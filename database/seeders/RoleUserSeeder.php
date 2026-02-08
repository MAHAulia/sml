<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("role_users")->insert([
            ["user_id" => "1", "role_id" => "1"],
            ["user_id" => "1", "role_id" => "2"],
            ["user_id" => "1", "role_id" => "3"],
            ["user_id" => "1", "role_id" => "4"],
            ["user_id" => "1", "role_id" => "5"],
            ["user_id" => "1", "role_id" => "6"],
            ["user_id" => "1", "role_id" => "7"],
            ["user_id" => "1", "role_id" => "8"],
            ["user_id" => "1", "role_id" => "9"],
            ["user_id" => "2", "role_id" => "9"],
        ]);
    }
}
