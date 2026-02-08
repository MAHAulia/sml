<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Menu::with("parent")->get();
        $parentMenu = Menu::where('is_parent', true)->get();

        return Inertia::render('menus/menu', [
            "listMenu" => $data,
            "parentMenu" => $parentMenu,
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
            "label" => "required|string|max:255",
            "route_name" => "required|string|max:255|unique:menus,route_name",
            "icon" => "required|string|max:255",
            "type" => "required|string|max:255",
            "is_parent" => "required|boolean|max:255",
        ], [
            "label.required" => "Nama wajib diisi.",
            "route_name.required" => "Nama route wajib diisi.",
            "route_name.unique" => "Nama route sudah pernah digunakan",
            "icon.required" => "Icon wajib diisi.",
            "type.required" => "Tipe menu wajib diisi.",
            "is_parent.required" => "Jenis menu wajib diisi.",
        ]);

        if (!$request->is_parent) {
            $request->validate([
                "parent_id" => "required|string|max:255",
            ], [
                "parent_id.required" => "Menu induk harus diisi.",
            ]);
        }

        $orderNumber = 1;
        if (!$request->is_parent) {
            $lastNumber = Menu::select("id", "order_number")->where("parent_id", $request->parent_id)->orderBy("order_number", "DESC")->first();

            $orderNumber = $lastNumber ? $lastNumber->order_number + 1 : 1;
        }

        Menu::create([
            "label" => $request->label,
            "route_name" => $request->route_name,
            "icon" => $request->icon,
            "type" => $request->type,
            "is_parent" => $request->is_parent,
            "parent_id" => $request->parent_id,
            "order_number" => $orderNumber,
        ]);

        return to_route("menu.index")->with('flash', [
            'type' => 'success',
            'title' => 'Penambahan Menu Berhasil',
            'message' => 'Data menu baru berhasil ditambahkan.',
        ]);
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
        $data = Menu::where("id", $id)->first();
        if (!$data) {
            return to_route("menu.index")->with('flash', [
                'type' => 'error',
                'title' => 'Pembaharuan Data Menu Gagal',
                'message' => 'Data menu tidak ditemukan.',
            ]);
        }


        $data->label = $request->label;
        $data->route_name = $request->route_name;
        $data->icon = $request->icon;
        $data->type = $request->type;
        $data->is_parent = $request->is_parent;
        if ($request->is_parent) {
            $data->parent_id = null;
        } else {
            $data->parent_id = $request->parent_id;
        }

        $data->save();

        return to_route("menu.index")->with('flash', [
            'type' => 'success',
            'title' => 'Pembaharuan Data Menu Berhasil',
            'message' => 'Data menu terlah berhasil diperbaharui.',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Menu::where("id", $id)->first();
        if (!$data) {
            return to_route("menu.index")->with('flash', [
                'type' => 'error',
                'title' => 'Hapus Menu Gagal',
                'message' => 'Data menu tidak ditemukan.',
            ]);
        }

        $data->delete();

        return to_route("menu.index")->with('flash', [
            'type' => 'success',
            'title' => 'Berhasil Hapus Menu',
            'message' => 'Data menu berhasil dihapus.',
        ]);
    }
}
