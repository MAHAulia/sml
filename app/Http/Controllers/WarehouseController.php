<?php

namespace App\Http\Controllers;

use App\Models\Kantor;
use App\Models\Manifest;
use App\Models\ManifestDetail;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function manifestTerima(Request $request)
    {
        $user = Auth::user();

        $datas = Manifest::where("user_id", $user->id)->with("items")->latest()->get();
        $kantors = Kantor::all();
        $tujuans = Role::whereIn("name", ["Pickup", "Delivery", "Warehouse"])->get();
        if ($request->t == "local") {
            $manifest = Manifest::where("code", $request->m)->first();
            $dataSelected = ManifestDetail::where("manifest_id", $manifest->id)->get();
        } else {
            $dataSelected = [];
        }

        return Inertia::render('manifest-terima/index', [
            "datas" => $datas,
            "kantors" => $kantors,
            "tujuans" => $tujuans,
            "data_selected" => $dataSelected,
        ]);
    }

    public function createManifestTerima(Request $request)
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
                if (count($request->selectedItem) == 0) {
                    ManifestDetail::where("manifest_id", $isExist->id)->delete();
                } else {
                    foreach ($request->selectedItem as $key => $value) {
                        $manifestDetail = new ManifestDetail();
                        $manifestDetail->manifest_id = $isExist->id;
                        $manifestDetail->item_id = $value;
                        $manifestDetail->save();
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

        return redirect()->route("pickup.manifest_serah");
    }
}
