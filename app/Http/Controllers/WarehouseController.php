<?php

namespace App\Http\Controllers;

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
}
