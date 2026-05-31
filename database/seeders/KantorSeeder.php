<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KantorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table("kantors")->insert([
            ["code" => "BDG", "name" => "BANDUNG", "address" => "Jl. Merdeka No. 1", "phone" => "081234567890", "email" => "kantor1@example.com"],
            ["code" => "SMG", "name" => "SEMARANG", "address" => "Jl. Merdeka No. 1", "phone" => "081234567890", "email" => "kantor2@example.com"],
        ]);
    }
}
