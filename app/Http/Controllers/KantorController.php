<?php

namespace App\Http\Controllers;

use App\Models\Kantor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KantorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $kantors = Kantor::select("id", "code", "name", "address", "phone", "email")->get();
        return Inertia::render('mobil/index', [
            "kantors" => $kantors,
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
            'code' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'required|string|max:255',
        ], [
            "code.required" => "Kode kantor wajib diisi.",
            "name.required" => "Nama wajib diisi.",
            "address.required" => "Alamat wajib diisi.",
            "phone.required" => "Nomor Telepon wajib diisi.",
            "email.required" => "Email wajib diisi.",
        ]);

        try {
            Kantor::create([
                'code' => $request->code,
                'name' => $request->name,
                'address' => $request->address,
                'phone' => $request->phone,
                'email' => $request->email,
            ]);

            return to_route("kantor.index")->with('flash', [
                'type' => 'success',
                'title' => 'Penambahan Kantor Berhasil',
                'message' => 'Data Kantor baru berhasil ditambahkan.',
            ]);
        } catch (\Throwable $th) {
            return to_route("kantor.index")->with('flash', [
                'type' => 'error',
                'title' => 'Gagal mendaftarkan Kantor',
                'message' => 'Gagal mendaftarkan Kantor, ' . $th->getMessage(),
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
        $data = Kantor::where("id", $id)->first();
        if (!$data) {
            return to_route("kantor.index")->with('flash', [
                'type' => 'error',
                'title' => 'Pembaharuan Data Kantor Gagal',
                'message' => 'Data Kantor tidak ditemukan.',
            ]);
        }

        try {
            $data->nopol = $request->nopol;
            $data->merek = $request->merek;
            $data->description = $request->description;
            $data->save();

            return to_route("kantor.index")->with('flash', [
                'type' => 'success',
                'title' => 'Pembaharuan Data Kantor Berhasil',
                'message' => 'Data Kantor terlah berhasil diperbaharui.',
            ]);
        } catch (\Throwable $th) {

            return to_route("kantor.index")->with('flash', [
                'type' => 'error',
                'title' => 'Pembaharuan Data Kantor Gagal',
                'message' => $th->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Kantor::where("id", $id)->first();
        if (!$data) {
            return to_route("kantor.index")->with('flash', [
                'type' => 'error',
                'title' => 'Hapus Kantor Gagal',
                'message' => 'Data Kantor tidak ditemukan.',
            ]);
        }

        $data->delete();

        return to_route("kantor.index")->with('flash', [
            'type' => 'success',
            'title' => 'Berhasil Hapus Kantor',
            'message' => 'Data Kantor berhasil dihapus.',
        ]);
    }
}
