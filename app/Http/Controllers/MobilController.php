<?php

namespace App\Http\Controllers;

use App\Models\Mobil;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MobilController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $mobils = Mobil::select("id", "nopol", "merek", "description")->get();
        return Inertia::render('mobil/index', [
            "mobils" => $mobils,
            // 'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            // 'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nopol' => 'required|string|max:255',
            'merek' => 'required|string|max:255',
        ], [
            "nopol.required" => "Nomor polisi wajib diisi.",
            "merek.required" => "Merek wajib diisi.",
        ]);

        try {
            Mobil::create([
                'nopol' => $request->nopol,
                'merek' => $request->merek,
                'description' => $request->description,
            ]);

            return to_route("mobil.index")->with('flash', [
                'type' => 'success',
                'title' => 'Penambahan mobil Berhasil',
                'message' => 'Data mobil baru berhasil ditambahkan.',
            ]);
        } catch (\Throwable $th) {
            return to_route("mobil.index")->with('flash', [
                'type' => 'error',
                'title' => 'Gagal mendaftarkan mobil',
                'message' => 'Gagal mendaftarkan mobil, ' . $th->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = Mobil::where("id", $id)->first();
        if (!$data) {
            return to_route("mobil.index")->with('flash', [
                'type' => 'error',
                'title' => 'Pembaharuan Data Mobil Gagal',
                'message' => 'Data Mobil tidak ditemukan.',
            ]);
        }

        try {
            $data->nopol = $request->nopol;
            $data->merek = $request->merek;
            $data->description = $request->description;
            $data->save();

            return to_route("mobil.index")->with('flash', [
                'type' => 'success',
                'title' => 'Pembaharuan Data Mobil Berhasil',
                'message' => 'Data Mobil terlah berhasil diperbaharui.',
            ]);
        } catch (\Throwable $th) {

            return to_route("mobil.index")->with('flash', [
                'type' => 'error',
                'title' => 'Pembaharuan Data Mobil Gagal',
                'message' => $th->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Mobil::where("id", $id)->first();
        if (!$data) {
            return to_route("mobil.index")->with('flash', [
                'type' => 'error',
                'title' => 'Hapus Mobil Gagal',
                'message' => 'Data Mobil tidak ditemukan.',
            ]);
        }

        $data->delete();

        return to_route("mobil.index")->with('flash', [
            'type' => 'success',
            'title' => 'Berhasil Hapus Mobil',
            'message' => 'Data Mobil berhasil dihapus.',
        ]);
    }


}
