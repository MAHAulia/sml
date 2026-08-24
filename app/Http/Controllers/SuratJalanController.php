<?php

namespace App\Http\Controllers;

use App\Models\Kantor;
use App\Models\Manifest;
use App\Models\Mobil;
use App\Models\SuratJalan;
use App\Models\SuratJalanDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SuratJalanController extends Controller
{
    public function index()
    {
        $datas = SuratJalan::with("items")->get();
        $kantors = Kantor::all();
        $mobils = Mobil::all();
        return Inertia::render('surat-jalan/index', compact('datas', 'kantors', 'mobils'));
    }

    public function createSuratJalan(Request $request)
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
            try {
                $manifest = Manifest::where("code", $request->m)->with('items')->first();
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

                DB::beginTransaction();


                $manifest->status = "send";
                $manifest->save();

                event(new ManifestCreated($manifest));

                DB::commit();

                return redirect()->back()->with('flash', [
                    'type' => 'success',
                    'title' => 'Data manifest berhasil disimpan',
                    'message' => 'Data manifest berhasil disimpan, silahkan lanjutkan proses berikutnya',
                ]);

            } catch (\Throwable $th) {
                DB::rollBack();
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Manifest gagal ditutup',
                    'message' => $th->getMessage(),
                ]);
            }

        }

        $isExist = SuratJalan::where("user_id", $user->id)
            ->where("mobil_id", $request->mobil_id)
            ->where("to", $request->to)
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
                        SuratJalanDetail::where("manifest_id", $isExist->id)->delete();
                } else {
                    foreach ($request->selectedItem as $key => $value) {
                        SuratJalanDetail::updateOrCreate(
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
            $mobil = Mobil::find($request->mobil_id)->with("sopir")->first();

            $suratJalan = new SuratJalan();
            $suratJalan->code = "SJL" . $request->to . $user->id . date("YmdHis");
            $suratJalan->status = "created";
            $suratJalan->user_id = $user->id;
            $suratJalan->mobil_id = $request->mobil_id;
            $suratJalan->nopol = $mobil?->nopol;
            $suratJalan->driver_id = $mobil?->sopir?->id;            
            $suratJalan->to = $request->to;
            $suratJalan->save();
        }

        return redirect()->route("warehouse.surat_jalan");
    }
}
