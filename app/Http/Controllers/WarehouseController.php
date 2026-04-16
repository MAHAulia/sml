<?php

namespace App\Http\Controllers;

use App\Models\Bag;
use App\Models\BagDetail;
use App\Models\Kantor;
use App\Models\Manifest;
use App\Models\ManifestDetail;
use App\Models\Role;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function manifestTerima(Request $request)
    {
        $user = Auth::user();
        $role = $user->roles()->first();
        $datas = Manifest::whereNot("status", "created")
            ->where("to", $role->name)
            ->where("office_to", $user->office)
            ->with("items")
            ->latest()
            ->get();

        $kantors = Kantor::all();
        $tujuans = Role::whereIn("name", ["Pickup", "Delivery", "Warehouse"])->get();
        if ($request->t == "local") {
            $manifest = Manifest::where("code", $request->m)->first();

            $dataManifest = Transaction::leftJoin('manifest_details', 'transactions.id', '=', 'manifest_details.item_id')
                ->where('manifest_details.manifest_id', $manifest->id);

            if ($request->v != "T") {
                $dataManifest->where('manifest_details.status', 'created');
            }

            $dataManifest = $dataManifest->select('transactions.*')
                ->get();
            $dataSelected = Transaction::leftJoin('manifest_details', 'transactions.id', '=', 'manifest_details.item_id')
                ->where('manifest_details.manifest_id', $manifest->id)
                ->where('manifest_details.status', 'received')
                ->select('transactions.*')
                ->get();
        } else {
            $dataManifest = [];
            $dataSelected = [];
        }

        return Inertia::render('manifest-terima/index', [
            "datas" => $datas,
            "kantors" => $kantors,
            "tujuans" => $tujuans,
            "data_manifest" => $dataManifest,
            "data_selected" => $dataSelected,
        ]);
    }

    public function createManifestTerima(Request $request)
    {
        if ($request->a == 'approval') {
            $manifest = Manifest::where("code", $request->m)->first();
            if (!$manifest) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Manifest Tidak Ditemukan',
                    'message' => 'Data manifest yang akan anda tutup tidak ditemukan.',
                ]);
            }

            if ($manifest->status != "send") {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Manifest Sudah Memiliki Status',
                    'message' => 'Saat ini manifest ' . $request->m . ' sudah memiliki status ' . strtoupper($manifest->status) . ".",
                ]);
            }

            ManifestDetail::whereNotIn("item_id", $request->selectedItem)
                ->where("manifest_id", $manifest->id)
                ->update(["status" => "created"]);

            ManifestDetail::whereIn("item_id", $request->selectedItem)
                ->where("manifest_id", $manifest->id)
                ->update(["status" => "received"]);

            if (count($request->items) == 0) {
                $manifest->status = "received";
                $manifest->save();
            }

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Data manifest berhasil disimpan',
                'message' => 'Data manifest berhasil disimpan, silahkan lanjutkan proses berikutnya',
            ]);
        }

        return redirect()->route("warehouse.manifest_terima");
    }

    public function baging(Request $request)
    {
        $user = Auth::user();
        $role = $user->roles()->first();
        $datas = Bag::where("status", "created")
            ->where("user_id", $user->id)
            ->where("office", $user->office)
            ->with("items")
            ->latest()
            ->get();

        $kantors = Kantor::all();
        $tujuans = Role::whereIn("name", ["Pickup", "Delivery", "Warehouse"])->get();
        if ($request->t == "local") {
            $manifest = Manifest::where("code", $request->m)->first();

            $dataManifest = Transaction::leftJoin('manifest_details', 'transactions.id', '=', 'manifest_details.item_id')
                ->where('manifest_details.manifest_id', $manifest->id);

            if ($request->v != "T") {
                $dataManifest->where('manifest_details.status', 'created');
            }

            $dataManifest = $dataManifest->select('transactions.*')
                ->get();
            $dataSelected = Transaction::leftJoin('manifest_details', 'transactions.id', '=', 'manifest_details.item_id')
                ->where('manifest_details.manifest_id', $manifest->id)
                ->where('manifest_details.status', 'received')
                ->select('transactions.*')
                ->get();
        } else {
            $dataManifest = [];
            $dataSelected = [];
        }

        return Inertia::render('baging/index', [
            "datas" => $datas,
            "kantors" => $kantors,
            "tujuans" => $tujuans,
            "data_manifest" => $dataManifest,
            "data_selected" => $dataSelected,
        ]);
    }

    public function createBagging(Request $request)
    {
        $user = Auth::user();

        if ($request->a == 'delete') {
            $bag = Bag::where("code", $request->m)->first();
            if (!$bag) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Kantong Tidak Ditemukan',
                    'message' => 'Data Kantong yang akan anda tutup tidak ditemukan.',
                ]);
            }

            if ($bag->status != "created") {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Kantong Sudah Memiliki Status',
                    'message' => 'Saat ini kantong ' . $request->m . ' sudah memiliki status ' . strtoupper($bag->status) . ".",
                ]);
            }

            $bag->delete();

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Data kantong berhasil disimpan',
                'message' => 'Data kantong berhasil disimpan, silahkan lanjutkan proses berikutnya',
            ]);
        }

        if ($request->a == 'approval') {
            $bag = Bag::where("code", $request->m)->first();
            if (!$bag) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Kantong Tidak Ditemukan',
                    'message' => 'Data kantong yang akan anda tutup tidak ditemukan.',
                ]);
            }

            if ($bag->status != "created") {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Kantong Sudah Memiliki Status',
                    'message' => 'Saat ini kantong ' . $request->m . ' sudah memiliki status ' . strtoupper($bag->status) . ".",
                ]);
            }

            // $bag->status = "manifested";
            // $bag->save();

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Data kantong berhasil disimpan',
                'message' => 'Data kantong berhasil disimpan, silahkan lanjutkan proses berikutnya',
            ]);
        }

        $role = $user->roles()->first();
        $isExist = Bag::where("user_id", $user->id)
            ->where("office", $user->office)
            ->where("status", "created")
            ->first();

        if ($isExist) {
            if (!$request->manifest) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Kantong Sebelumnya Sudah Dibuat',
                    'message' => 'Kantong untuk tujuan ini sudah dibuat sebelumnya.',
                ]);
            } else {
                if (count($request->selectedItem) == 0) {
                    BagDetail::where("bag_id", $isExist->id)->delete();
                } else {
                    foreach ($request->selectedItem as $key => $value) {
                        $bagDetail = new BagDetail();
                        $bagDetail->bag_id = $isExist->id;
                        $bagDetail->item_id = $value;
                        $bagDetail->save();
                    }
                }

                return redirect()->back()->with('flash', [
                    'type' => 'success',
                    'title' => 'Data kantong berhasil disimpan',
                    'message' => 'Data kantong berhasil disimpan, silahkan lanjutkan proses berikutnya',
                ]);
            }
        } else {
            $bag = new Bag();
            $bag->code = "BAG" . $user->id . date("YmdHis");
            $bag->user_id = $user->id;
            $bag->office = $user->office;
            $bag->status = "created";
            $bag->save();
        }

        return redirect()->route("warehouse.baging");
    }
}
