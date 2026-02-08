<?php

namespace App\Http\Controllers\Users;

use App\Events\PenggunaRegistered;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\Role;
use App\Models\RoleUser;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Auth\Events\Verified;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $data = User::select("users.id", "users.name", "users.email", "users.email_verified_at", "users.created_at", "role_users.role_id", "roles.name as role")
            ->leftJoin("role_users", "role_users.user_id", "users.id")
            ->leftJoin("roles", "roles.id", "role_users.role_id")
            ->where("users.id", "!=", 1)->get();
        $roles = Role::select("id", "name", "description")->where("id", "!=", 1)->get();
        return Inertia::render('users/user', [
            "users" => $data,
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
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            "role" => "required|exists:roles,id",
        ], [
            "name.required" => "Nama wajib diisi.",
            "email.required" => "Email wajib diisi.",
            "email.email" => "Format email tidak valid.",
            "email.unique" => "Email sudah terdaftar.",
            "email.lowercase" => "Email harus dalam huruf kecil semua.",
            "role.required" => "Peran wajib dipilih.",
            "role.exists" => "Peran yang dipilih tidak valid.",
        ]);

        try {
            DB::beginTransaction();
            // Simpan data ke dalam tabel users
            if (config('app.env') != 'production') {
                $password = 'thepasswordissecret';
            } else {
                $password = Str::random(8);
            }

            $data = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($password), // Optional if needed
            ];

            if (config('app.env') != 'production') {
                $data['email_verified_at'] = date("Y-m-d H:i:s");
            }

            
            $user = User::create($data);

            RoleUser::create([
                'user_id' => $user->id,
                'role_id' => $validated["role"],
            ]);

            // set ke plain password, to send in email verification
            $raw_password = $password;

            event(new PenggunaRegistered($user, $raw_password));

            DB::commit();

            return to_route("pengguna.index")->with('flash', [
                'type' => 'success',
                'title' => 'Penambahan Pengguna Berhasil',
                'message' => 'Data pengguna baru berhasil ditambahkan, silahkan cek email terdaftar untuk melanjutkan proses verifikasi.',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return to_route("pengguna.index")->with('flash', [
                'type' => 'error',
                'title' => 'Gagal mendaftarkan pengguna',
                'message' => 'Gagal mendaftarkan pengguna, ' . $th->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user, $id)
    {
        $user = User::where("id", $id)->first();
        if (!$user) {
            return to_route("pengguna.index")->with('flash', [
                'type' => 'error',
                'title' => 'Pembaharuan Data Pengguna Gagal',
                'message' => 'Data pengguna tidak ditemukan.',
            ]);
        }

        DB::beginTransaction();
        try {
            $user->name = $request->name;
            $user->email = $request->email;
            $user->save();

            $role = RoleUser::where("user_id", $user->id)->where("role_id", $request->role)->first();
            if ($role) {
                $role->role_id = $request->role;
                $role->save();
            } else {
                $role = new RoleUser();
                $role->user_id = $user->id;
                $role->role_id = $request->role;
                $role->save();
            }
            DB::commit();

            return to_route("pengguna.index")->with('flash', [
                'type' => 'success',
                'title' => 'Pembaharuan Data Pengguna Berhasil',
                'message' => 'Data pengguna terlah berhasil diperbaharui.',
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return to_route("pengguna.index")->with('flash', [
                'type' => 'error',
                'title' => 'Pembaharuan Data Pengguna Gagal',
                'message' => $th->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, $id)
    {
        $user = User::where("id", $id)->first();
        if (!$user) {
            return to_route("pengguna.index")->with('flash', [
                'type' => 'error',
                'title' => 'Hapus Pengguna Gagal',
                'message' => 'Data pengguna tidak ditemukan.',
            ]);
        }

        $user->delete();

        return to_route("pengguna.index")->with('flash', [
            'type' => 'success',
            'title' => 'Berhasil Hapus Pengguna',
            'message' => 'Data pengguna berhasil dihapus.',
        ]);
    }

    /**
     * Verify new user
     */
    public function verify(Request $request, $id, $hash)
    {


        $user = User::where('id', $id)->first();
        if (!$user) {
            abort(403, "Unauthorized");
            return;
        }
        if (! hash_equals((string) $user->getKey(), (string) $id)) {
            abort(403, "Unauthorized");
            return;
        }

        if (! hash_equals(sha1($user->getEmailForVerification()), (string) $hash)) {
            abort(403, "Unauthorized");
            return;
        }

        Auth::login($user);

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('home', absolute: false) . '?verified=1');
        }

        if ($user->markEmailAsVerified()) {
            /** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $user;

            event(new Verified($user));
        }

        return redirect()->intended(route('home', absolute: false) . '?verified=1');
    }

    public function resendVerify(Request $request, $id)
    {
        $user = User::where("id", $id)->first();
        if (!$user) {
            return to_route("pengguna.index")->with('flash', [
                'type' => 'error',
                'title' => 'Kirim Ulang Tautan Verifikasi Gagal',
                'message' => 'Data pengguna tidak ditemukan.',
            ]);
        }
        $password = Str::random(8);
        $raw_password = $password;
        $user->password = bcrypt($raw_password);
        $user->save();

        event(new PenggunaRegistered($user, $raw_password));

        return to_route("pengguna.index")->with('flash', [
            'type' => 'success',
            'title' => 'Kirim Ulang Tautan Verifikasi Berhasil',
            'message' => 'Tautan verifikasi telah dikirimkan ke email ' . $user->email . ', silahkan periksa email untuk melaukan verifikasi pengguna.',
        ]);
    }
}
