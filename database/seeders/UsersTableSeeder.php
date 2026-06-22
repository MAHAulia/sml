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
            'office' => "BDG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 1
        DB::table('users')->insert([
            'name' => 'IT Administrator',
            'email' => 'it-admin@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'office' => "BDG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 2
        DB::table('users')->insert([
            'name' => 'Marketing',
            'email' => 'marketing@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'office' => "BDG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 3
        DB::table('users')->insert([
            'name' => 'Customer Services',
            'email' => 'cs@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'office' => "BDG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 4
        DB::table('users')->insert([
            'name' => 'Pick Up',
            'email' => 'pickup@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'office' => "BDG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 5
        DB::table('users')->insert([
            'name' => 'Delivery',
            'email' => 'delivery@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'office' => "BDG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 6
        DB::table('users')->insert([
            'name' => 'Warehouse',
            'email' => 'warehouse@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'office' => "BDG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 7
        DB::table('users')->insert([
            'name' => 'Accounting',
            'email' => 'accounting@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'office' => "BDG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 8
        DB::table('users')->insert([
            'name' => 'Human Resources',
            'email' => 'hr@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'office' => "BDG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 9
        DB::table('users')->insert([
            'name' => 'Delivery SMG',
            'email' => 'delivery.smg@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'office' => "SMG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 10
        DB::table('users')->insert([
            'name' => 'Warehouse SMG',
            'email' => 'warehouse.smg@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'office' => "SMG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 11
        DB::table('users')->insert([
            'name' => 'Driver',
            'email' => 'driver@email.com',
            'email_verified_at' => now(),
            'password' => Hash::make('thepasswordissecret'),
            'office' => "BDG",
            'created_at' => now(),
            'updated_at' => now()
        ]); // 12

    }
}
