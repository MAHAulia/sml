<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Super Administrator',
            'email' => 'super-admin@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'created_at' => now(),
            'updated_at' => now()
        ]);
        DB::table('users')->insert([
            'name' => 'IT Administrator',
            'email' => 'it-admin@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'created_at' => now(),
            'updated_at' => now()
        ]);

    }
}
