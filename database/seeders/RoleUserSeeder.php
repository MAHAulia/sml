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
            ["user_id" => "2", "role_id" => "9"], // IT Administrator
            ["user_id" => "3", "role_id" => "2"], // Marketing
            ["user_id" => "4", "role_id" => "3"], // Customer Services
            ["user_id" => "5", "role_id" => "4"], // Pick Up
            ["user_id" => "6", "role_id" => "5"], // Delivery
            ["user_id" => "7", "role_id" => "6"], // Warehouse
            ["user_id" => "8", "role_id" => "7"], // Accounting
            ["user_id" => "9", "role_id" => "8"], // Human Resources
        ]);
    }
}
