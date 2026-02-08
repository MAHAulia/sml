<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("role_menus")->insert([
            ["menu_id" => "1", "role_id" => "1"],
            ["menu_id" => "1", "role_id" => "2"],
            ["menu_id" => "1", "role_id" => "3"],
            ["menu_id" => "1", "role_id" => "4"],
            ["menu_id" => "1", "role_id" => "5"],
            ["menu_id" => "1", "role_id" => "6"],
            ["menu_id" => "1", "role_id" => "7"],
            ["menu_id" => "1", "role_id" => "8"],
            ["menu_id" => "1", "role_id" => "9"],

            ["menu_id" => "2", "role_id" => "1"],
            ["menu_id" => "3", "role_id" => "1"],
            ["menu_id" => "4", "role_id" => "1"],
            ["menu_id" => "5", "role_id" => "1"],
            ["menu_id" => "6", "role_id" => "1"],
            ["menu_id" => "7", "role_id" => "1"],
            ["menu_id" => "8", "role_id" => "1"],
            ["menu_id" => "9", "role_id" => "1"],
            ["menu_id" => "10", "role_id" => "1"],
            ["menu_id" => "11", "role_id" => "1"],
            ["menu_id" => "12", "role_id" => "1"],
            ["menu_id" => "13", "role_id" => "1"],
            ["menu_id" => "14", "role_id" => "1"],
            ["menu_id" => "15", "role_id" => "1"],
            ["menu_id" => "16", "role_id" => "1"],
            ["menu_id" => "17", "role_id" => "1"],
            ["menu_id" => "18", "role_id" => "1"],
            ["menu_id" => "19", "role_id" => "1"],
            ["menu_id" => "20", "role_id" => "1"],
            ["menu_id" => "21", "role_id" => "1"],
            ["menu_id" => "22", "role_id" => "1"],
            ["menu_id" => "23", "role_id" => "1"],
            ["menu_id" => "24", "role_id" => "1"],
            ["menu_id" => "25", "role_id" => "1"],
            ["menu_id" => "26", "role_id" => "1"],
            ["menu_id" => "27", "role_id" => "1"],

            ["menu_id" => "2", "role_id" => "9"],
            ["menu_id" => "3", "role_id" => "9"],
            ["menu_id" => "4", "role_id" => "9"],
            ["menu_id" => "5", "role_id" => "9"],
            ["menu_id" => "6", "role_id" => "9"],
            ["menu_id" => "7", "role_id" => "9"],
            ["menu_id" => "8", "role_id" => "9"],
            ["menu_id" => "9", "role_id" => "9"],
            ["menu_id" => "10", "role_id" => "9"],
        ]);
    }
}
