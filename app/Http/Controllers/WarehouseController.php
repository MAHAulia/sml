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
        $datas = Bag::where("user_id", $user->id)
            ->where("office", $user->office)
            ->with("items")
            ->latest()
            ->get();

        $kantors = Kantor::all();
        $tujuans = Role::whereIn("name", ["Pickup", "Delivery", "Warehouse"])->get();
        if ($request->m) {

            $bag = Bag::where("code", $request?->m)->first();

            $dataBags = Transaction::leftJoin('manifest_details', 'transactions.id', '=', 'manifest_details.item_id')
                ->leftJoin('manifests', 'manifest_details.manifest_id', '=', 'manifests.id')
                ->leftJoin('bag_details', 'transactions.id', '=', 'bag_details.transaction_id')
                ->whereNull('bag_details.transaction_id')
                ->where('manifests.status', 'received')
                ->where('manifest_details.status', 'received')
                ->where('manifests.office_to', $user->office)
                ->where('manifests.type', 'local');

            $dataBags = $dataBags->select('transactions.*')
                ->get();

            $dataSelected = Transaction::leftJoin('manifest_details', 'transactions.id', '=', 'manifest_details.item_id')
                ->leftJoin('manifests', 'manifest_details.manifest_id', '=', 'manifests.id')
                ->leftJoin('bag_details', 'transactions.id', '=', 'bag_details.transaction_id')
                ->where('manifests.status', 'received')
                ->where('manifest_details.status', 'received')
                ->where('manifests.office_to', $user->office)
                ->where('manifests.type', 'local')
                ->select('transactions.*');

            if ($request->v != "T") {
                $dataSelected->where("bag_details.bag_id", $bag?->id)
                            ->where('bag_details.status', 'created');
            } else {
                $dataSelected->where('bag_details.status', 'bagged');
            }

            $dataSelected = $dataSelected->get();
        } else {
            $dataBags = [];
            $dataSelected = [];
        }

        return Inertia::render('baging/index', [
            "datas" => $datas,
            "kantors" => $kantors,
            "tujuans" => $tujuans,
            "data_bags" => $dataBags,
            "data_selected" => $dataSelected,
        ]);
    }

    public function createBagging(Request $request)
    {
        $user = Auth::user();

        if ($request->a == 'delete') {
            $bag = Bag::where("code", $request->m)->withCount('items')->first();
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

            if ($bag->items_count > 0) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Kantong Masih Memiliki Item',
                    'message' => 'Kantong yang akan anda hapus masih memiliki item, pastikan item sudah dipindahkan ke kantong lain atau dihapus.',
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

            $bag->status = "bagged";
            $bag->save();

            BagDetail::where("bag_id", $bag->id)
                ->update(["status" => "bagged"]);   

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Data kantong berhasil disimpan',
                'message' => 'Data kantong berhasil disimpan, silahkan lanjutkan proses berikutnya',
            ]);
        }

        $isExist = Bag::where("user_id", $user->id)
            ->where("office", $user->office)
            ->where("status", "created")
            ->first();

        if ($isExist) {
            if (!$request->code) {
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
                        BagDetail::updateOrCreate(
                            [
                                'transaction_id' => $value, // kondisi pencarian
                            ],
                            [
                                'bag_id' => $isExist->id, // data yang diupdate / diinsert
                            ]
                        );
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
            $bag->office_to = $request->office_to;
            $bag->status = "created";
            $bag->save();
        }

        return redirect()->route("warehouse.baging");
    }
}
