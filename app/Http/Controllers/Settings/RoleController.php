<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Role;
use App\Models\RoleMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $roles = Role::select("id", "name", "description", "created_at")->get();
        return Inertia::render('roles/role', [
            "roles" => $roles,
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ], [
            "name.required" => "Nama wajib diisi.",
        ]);

        try {
            Role::create([
                'name' => $request->name,
                'description' => $request->description,
            ]);

            return to_route("role.index")->with('flash', [
                'type' => 'success',
                'title' => 'Penambahan Role/Peran Berhasil',
                'message' => 'Data role/peran baru berhasil ditambahkan.',
            ]);
        } catch (\Throwable $th) {
            return to_route("role.index")->with('flash', [
                'type' => 'error',
                'title' => 'Gagal mendaftarkan role/peran',
                'message' => 'Gagal mendaftarkan role/peran, ' . $th->getMessage(),
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
        $data = Role::where("id", $id)->first();
        if (!$data) {
            return to_route("role.index")->with('flash', [
                'type' => 'error',
                'title' => 'Pembaharuan Data Role/Peran Gagal',
                'message' => 'Data Role/Peran tidak ditemukan.',
            ]);
        }

        try {
            $data->name = $request->name;
            $data->description = $request->description;
            $data->save();

            return to_route("role.index")->with('flash', [
                'type' => 'success',
                'title' => 'Pembaharuan Data Role/Peran Berhasil',
                'message' => 'Data Role/Peran terlah berhasil diperbaharui.',
            ]);
        } catch (\Throwable $th) {

            return to_route("role.index")->with('flash', [
                'type' => 'error',
                'title' => 'Pembaharuan Data Role/Peran Gagal',
                'message' => $th->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Role::where("id", $id)->first();
        if (!$data) {
            return to_route("role.index")->with('flash', [
                'type' => 'error',
                'title' => 'Hapus Role/Peran Gagal',
                'message' => 'Data Role/Peran tidak ditemukan.',
            ]);
        }

        $data->delete();

        return to_route("role.index")->with('flash', [
            'type' => 'success',
            'title' => 'Berhasil Hapus Role/Peran',
            'message' => 'Data Role/Peran berhasil dihapus.',
        ]);
    }

    public function roleMapping(Role $role, Request $request)
    {

        // $assigned = Menu::with('childs') // ambil anak-anaknya juga
        //     ->whereHas('roles', function ($query) use ($role) {
        //         $query->where('role_id', $role->id);
        //     })
        //     ->where('is_parent', 1)
        //     ->get();
        // $unassigned = Menu::with('childs')
        //     // ->whereNotIn('id', $assigned->pluck('id'))
        //     ->where('is_parent', 1)
        //     ->get();
        // $menuData = [
        //     "unassigned" => $unassigned ?? [],
        //     "assigned" => $assigned ?? []
        // ];

        $mappedMenuIds = RoleMenu::where('role_id', $role->id)
            ->pluck('menu_id')
            ->toArray();

        $menus = Menu::with('childs')
            ->where('is_parent', 1)
            ->get()
            ->map(function ($menu) use ($mappedMenuIds) {

                // First, map children and assign their is_mapped values
                $menu->childs = $menu->childs->map(function ($child) use ($mappedMenuIds) {
                    $child->is_mapped = in_array($child->id, $mappedMenuIds);
                    return $child;
                });

                // Parent is mapped initially based on DB
                $menu->is_mapped = in_array($menu->id, $mappedMenuIds);

                // If any child is NOT mapped, then force parent to false
                if ($menu->childs->contains(function ($child) {
                    return !$child->is_mapped;
                })) {
                    $menu->is_mapped = false;
                }

                return $menu;
            });


        // dd($menus->toArray());
        return Inertia::render('roles/role-mapping', [
            "menuData" => $menus,
            "role" => $role,
        ]);
    }

    public function updateRoleMapping(Role $role, Request $request)
    {

        $request->validate([
            "menus" => "required"
        ], [
            "menus.required" => "Data menu harus diisi"
        ]);

        $requestMenu = $request->menus; // Get the menus array

        foreach ($requestMenu as &$menu) {
            if (!empty($menu['childs'])) {
                foreach ($menu['childs'] as $child) {
                    if (!empty($child['is_mapped'])) {
                        $menu['is_mapped'] = true;
                        break;
                    }
                }
            }
        }

        DB::beginTransaction();
        try {
            // Extract the list of menu_ids from the nested structure
            $menus = collect($requestMenu);

            $menuIds = $menus->flatMap(function ($menu) {
                $ids = [];

                if (!empty($menu['is_mapped'])) {
                    $ids[] = $menu['id'];
                }

                if (!empty($menu['childs'])) {
                    foreach ($menu['childs'] as $child) {
                        if (!empty($child['is_mapped'])) {
                            $ids[] = $child['id'];
                        }
                    }
                }

                return $ids;
            })->unique()->values()->all();

            // Sync the role_menus table (upsert)
            $role->menus()->sync($menuIds);

            DB::commit();
            session()->forget('user_menus_' . auth()->id());
            return to_route("role.mappingmenutorole", ["role" => $role->id])->with('flash', [
                'type' => 'success',
                'title' => 'Mapping Role/Peran Ke Menu Berhasil Sisimpan',
                'message' => 'Data mapping role/peran ke menu berhasil disimpan.',
            ])->withInput();
        } catch (\Throwable $th) {
            DB::rollBack();
            return to_route("role.mappingmenutorole", ["role" => $role->id])->with('flash', [
                'type' => 'error',
                'title' => 'Gagal menyimpan mapping role/peran',
                'message' => 'Gagal menyimpan mapping role/peran, ' . $th->getMessage(),
            ])->withInput();
        }
    }
}
