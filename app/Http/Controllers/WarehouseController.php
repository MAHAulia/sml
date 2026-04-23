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
        } else if ($request->t == "linehaul") {
            $manifest = Manifest::where("code", $request->m)->first();

            // Data yang BELUM masuk manifest manapun
            $dataManifest = Bag::select('bags.*')
                ->leftJoin('manifest_details', 'bags.id', '=', 'manifest_details.item_id')
                // ->whereNull('manifest_details.item_id')
                // ->where('bags.office', $user->office)
                ->where('bags.status', 'manifested')
                ->get();

            // Data yang SUDAH masuk manifest tertentu
            $dataSelected = Bag::select('bags.*')
                ->join('manifest_details', 'bags.id', '=', 'manifest_details.item_id')
                ->where('manifest_details.manifest_id', $manifest?->id)
                // ->where('bags.office', $user->office)
                ->where('bags.status', 'received')
                ->get();

            // dd($dataManifest, $dataSelected);
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

    public function manifestSerah(Request $request)
    {
        $user = Auth::user();

        $datas = Manifest::where("user_id", $user->id)->with("items")->latest()->get();
        $kantors = Kantor::all();
        $tujuans = Role::whereIn("name", ["Delivery", "Warehouse"])->get();
        if ($request->t == "local") {
            $manifest = Manifest::where("code", $request->m)->first();
            $dataManifest = Transaction::leftJoin('manifest_details', 'transactions.id', '=', 'manifest_details.item_id')
                        ->whereNull('manifest_details.item_id')
                        ->where('transactions.pickuper_id', $user->id)
                        ->select('transactions.*')
                        ->get();
            $dataSelected = Transaction::join('manifest_details', 'transactions.id', '=', 'manifest_details.item_id')
                        ->where('manifest_details.manifest_id', $manifest?->id)
                        ->where('transactions.pickuper_id', $user->id)
                        ->select('transactions.*')
                        ->get();
        } else if ($request->t == "linehaul") {
            $manifest = Manifest::where("code", $request->m)->first();

            // Data yang BELUM masuk manifest manapun
            $dataManifest = Bag::select('bags.*')
                ->leftJoin('manifest_details', 'bags.id', '=', 'manifest_details.item_id')
                ->whereNull('manifest_details.item_id')
                ->where('bags.user_id', $user->id)
                ->where('bags.office', $user->office)
                ->where('bags.status', 'bagged')
                ->get();

            // Data yang SUDAH masuk manifest tertentu
            $dataSelected = Bag::select('bags.*')
                ->join('manifest_details', 'bags.id', '=', 'manifest_details.item_id')
                ->where('manifest_details.manifest_id', $manifest?->id)
                ->where('bags.user_id', $user->id)
                ->where('bags.office', $user->office)
                ->get();
        } else {
            $dataManifest = [];
            $dataSelected = [];
        }

        return Inertia::render('manifest-serah/index', [
            "datas" => $datas,
            "kantors" => $kantors,
            "tujuans" => $tujuans,
            "data_manifest" => $dataManifest,
            "data_selected" => $dataSelected,
        ]);
    }

    public function createManifestSerah(Request $request)
    {  
        $user = Auth::user();

        if ($request->a == 'delete') {
            $manifest = Manifest::where("code", $request->m)->first();
            if (!$manifest) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Manifest Tidak Ditemukan',
                    'message' => 'Data manifest yang akan anda tutup tidak ditemukan.',
                ]);
            }

            if ($manifest->status != "created") {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Manifest Sudah Memiliki Status',
                    'message' => 'Saat ini manifest ' . $request->m . ' sudah memiliki status ' . strtoupper($manifest->status) . ".",
                ]);
            }

            $manifest->delete();

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Data manifest berhasil disimpan',
                'message' => 'Data manifest berhasil disimpan, silahkan lanjutkan proses berikutnya',
            ]);

        }

        if ($request->a == 'approval') {      
            $manifest = Manifest::where("code", $request->m)->with("items")->first();
            if (!$manifest) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Manifest Tidak Ditemukan',
                    'message' => 'Data manifest yang akan anda tutup tidak ditemukan.',
                ]);
            }

            if ($manifest->status != "created") {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Manifest Sudah Memiliki Status',
                    'message' => 'Saat ini manifest ' . $request->m . ' sudah memiliki status ' . strtoupper($manifest->status) . ".",
                ]);
            }

            foreach ($manifest->items as $value) {
                BagDetail::where("bag_id", $value->item_id)
                    ->update(["status" => "manifested"]);
                Bag::where("id", $value->item_id)
                    ->update(["status" => "manifested"]);
            }

            $manifest->status = "send";
            $manifest->save();

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Data manifest berhasil disimpan',
                'message' => 'Data manifest berhasil disimpan, silahkan lanjutkan proses berikutnya',
            ]);

        }

        $role = $user->roles()->first();
        $isExist = Manifest::where("user_id", $user->id)
            ->where("office_to", $request->type == "local" ? $user->office : $request->office_to)
            ->where("to", $request->to)
            ->where("type", $request->type)
            ->where("status", "created")
            ->first();

        if ($isExist) {
            if (!$request->manifest) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Manifest Sebelumnya Sudah Dibuat',
                    'message' => 'Manifest untuk tujuan ini sudah dibuat sebelumnya.',
                ]);
            } else {
                if (count($request->selectedItem) == 0 ) {
                        ManifestDetail::where("manifest_id", $isExist->id)->delete();
                } else {
                    foreach ($request->selectedItem as $key => $value) {
                        ManifestDetail::updateOrCreate(
                            [
                                'item_id' => $value, // kondisi pencarian
                            ],
                            [
                                'manifest_id' => $isExist->id, // data yang diupdate / diinsert
                            ]
                        );
                    }
                }
                
                return redirect()->back()->with('flash', [
                    'type' => 'success',
                    'title' => 'Data manifest berhasil disimpan',
                    'message' => 'Data manifest berhasil disimpan, silahkan lanjutkan proses berikutnya',
                ]);
            }
        } else {
            $manifest = new Manifest();
            $manifest->code = "MNF" . $user->id . date("YmdHis");
            $manifest->user_id = $user->id;
            $manifest->from = $role->name ?? "";
            $manifest->office_from = $user->office;
            $manifest->office_to = $request->type == "local" ? $user->office : $request->office_to;
            $manifest->to = $request->to;
            $manifest->type = $request->type;
            $manifest->status = "created";
            $manifest->save();
        }

        return redirect()->route("warehouse.manifest_serah");
    }
}
