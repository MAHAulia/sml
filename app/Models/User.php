<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'whatsapp',
        'password',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_users', 'user_id', 'role_id');
    }

    public function hasRole($roles)
    {
        // 3
        // Simpan roles dalam properti agar tidak di-query berkali-kali
        $this->loadMissing('roles'); // Eager-load jika belum di-load

        return $this->roles->pluck('name')->intersect((array) $roles)->isNotEmpty();

        // 2
        // // Pastikan relasi 'roles' sudah dimuat (eager loaded)
        // // Jika belum dimuat, ini akan memuatnya sekali
        // $this->loadMissing('roles');

        // // Ubah $roles menjadi array jika belum
        // $roles = (array) $roles;

        // // Periksa apakah pengguna memiliki salah satu peran yang diberikan dalam koleksi yang sudah dimuat
        // return $this->roles->whereIn('name', $roles)->isNotEmpty();

        // 1
        // return $this->roles()->whereIn('name', (array) $roles)->exists();
    }

    public function menus()
    {
        return (new Menu())->displayMenus();
    }

    public function formulirs()
    {
        return $this->hasMany(Form::class, 'user_id', 'id');
    }

    public function formulirData()
    {
        return $this->hasManyThrough(FormData::class, Form::class, 'user_id', 'formulir_id', 'id', 'id');
    }
}
