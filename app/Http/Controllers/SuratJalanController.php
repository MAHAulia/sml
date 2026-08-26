<?php

namespace App\Http\Controllers;

use App\Events\ManifestCreated;
use App\Events\SuratJalanCreated;
use App\Models\Kantor;
use App\Models\Manifest;
use App\Models\Mobil;
use App\Models\SuratJalan;
use App\Models\SuratJalanDetail;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SuratJalanController extends Controller
{
    public function index(Request $request)
    {
        $datas = SuratJalan::with("items")->get();
        $kantors = Kantor::all();
        $mobils = Mobil::all();
        if ($request->t == "local") {
            $suratJalan = SuratJalan::where("code", $request->m)->first();
            $dataSuratJalan = Manifest::leftJoin('surat_jalan_details', 'manifests.id', '=', 'surat_jalan_details.manifest_id')
                        ->whereNull('surat_jalan_details.manifest_id')
                        ->where('manifests.type', 'linehaul')
                        ->where('manifests.status', 'send')
                        ->where('manifests.office_to', $suratJalan?->to)
                        // ->where('surat_jalan_details.surat_jalan_id', $suratJalan?->id)
                        ->select('manifests.*')
                        ->get();
            $dataSelected = Manifest::join('surat_jalan_details', 'manifests.id', '=', 'surat_jalan_details.manifest_id')
                        ->where('surat_jalan_details.surat_jalan_id', $suratJalan?->id)
                        ->select('manifests.*')
                        ->get();
        } else {
            $dataSuratJalan = [];
            $dataSelected = [];
        }
        return Inertia::render('surat-jalan/index', compact('datas', 'kantors', 'mobils', 'dataSuratJalan', 'dataSelected'));
    }

    public function createSuratJalan(Request $request)
    {  
        $user = Auth::user();

        if ($request->a == 'delete') {
            $suratJalan = SuratJalan::where("code", $request->m)->first();
            if (!$suratJalan) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Surat Jalan Tidak Ditemukan',
                    'message' => 'Data surat jalan yang akan anda tutup tidak ditemukan.',
                ]);
            }

            if ($suratJalan->status != "created") {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Surat Jalan Sudah Memiliki Status',
                    'message' => 'Saat ini surat jalan ' . $request->m . ' sudah memiliki status ' . strtoupper($suratJalan->status) . ".",
                ]);
            }

            $suratJalan->items()->delete();
            $suratJalan->delete();

            return redirect()->back()->with('flash', [
                'type' => 'success',
                'title' => 'Data surat jalan berhasil disimpan',
                'message' => 'Data surat jalan berhasil disimpan, silahkan lanjutkan proses berikutnya',
            ]);

        }

        if ($request->a == 'approval') {
            try {
                $suratJalan = SuratJalan::where("code", $request->m)->with('items')->first();
                if (!$suratJalan) {
                    return redirect()->back()->with('flash', [
                        'type' => 'error',
                        'title' => 'Surat Jalan Tidak Ditemukan',
                        'message' => 'Data surat jalan yang akan anda tutup tidak ditemukan.',
                    ]);
                }

                if ($suratJalan->status != "created") {
                    return redirect()->back()->with('flash', [
                        'type' => 'error',
                        'title' => 'Manifest Sudah Memiliki Status',
                        'message' => 'Saat ini manifest ' . $request->m . ' sudah memiliki status ' . strtoupper($suratJalan->status) . ".",
                    ]);
                }

                DB::beginTransaction();

                $suratJalan->status = "sending";
                $suratJalan->save();

                event(new SuratJalanCreated($suratJalan, $user, $suratJalan->status));

                DB::commit();

                return redirect()->back()->with('flash', [
                    'type' => 'success',
                    'title' => 'Data surat jalan berhasil disimpan',
                    'message' => 'Data surat jalan berhasil disimpan, silahkan lanjutkan proses berikutnya',
                ]);

            } catch (\Throwable $th) {
                DB::rollBack();
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Surat Jalan gagal disimpan',
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
            if (!$request->code) {
                return redirect()->back()->with('flash', [
                    'type' => 'error',
                    'title' => 'Surat Jalan Sebelumnya Sudah Dibuat',
                    'message' => 'Surat Jalan untuk tujuan ini sudah dibuat sebelumnya.',
                ]);
            } else {
                if (count($request->selectedItem) == 0 ) {
                        SuratJalanDetail::where("surat_jalan_id", $isExist->id)->delete();
                } else {
                    foreach ($request->selectedItem as $key => $value) {
                        SuratJalanDetail::updateOrCreate(
                            [
                                'manifest_id' => $value, // kondisi pencarian
                            ],
                            [
                                'surat_jalan_id' => $isExist->id, // data yang diupdate / diinsert
                            ]
                        );
                    }
                }
                
                return redirect()->back()->with('flash', [
                    'type' => 'success',
                    'title' => 'Data surat jalan berhasil disimpan',
                    'message' => 'Data surat jalan berhasil disimpan, silahkan lanjutkan proses berikutnya',
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

    public function printSuratJalan(String $code)
    {
        try {
            $manifest = Manifest::with([
                'creator',
                'receiver',
                'items',
            ])
                ->where('code', $code)
                ->firstOrFail();

            return Pdf::loadView('print.manifest', [
                'manifest' => $manifest
            ])
                ->setPaper('a4', 'portrait')
                ->stream("manifest-{$code}.pdf");
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Manifest not found or an error occurred.'], 404);
        }
    }
}
