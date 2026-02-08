<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string("name", 150)->uniqid();
            $table->string("description")->nullable();
            $table->timestamps();
        });

        DB::table("roles")->insert([
            ["name" => "Super Administrator"], // 1
            ["name" => "Marketing"], // 2
            ["name" => "Customer Services"], // 3
            ["name" => "Pick Up"], // 4
            ["name" => "Delivery"], // 5
            ["name" => "Warehouse"], // 6
            ["name" => "Accounting"], // 7
            ["name" => "Human Resources"], // 8
            ["name" => "IT Administrator"], // 9
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
