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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string("label", 50);
            $table->string("route_name", 100);
            $table->string("icon", 100);
            $table->enum("type", ["menu", "form", "api", "default"])->default("menu");
            $table->boolean("is_parent")->default(true);
            $table->unsignedBigInteger("parent_id")->nullable();
            $table->unsignedInteger("order_number");
            $table->timestamps();
        });

        DB::table("menus")->insert([
            ["label" => "Dashboard", "route_name" => "dashboard", "icon" => "LayoutGrid", "is_parent" => true, "parent_id" => null, "order_number" => 1, "type" => "menu"],

            ["label" => "Settings", "route_name" => "", "icon" => "Settings", "is_parent" => true, "parent_id" => null, "order_number" => 1, "type" => "menu"],

            ["label" => "Pengguna", "route_name" => "pengguna.index", "icon" => "Settings", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "menu"],
            ["label" => "Tambah Pengguna", "route_name" => "pengguna.create", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "form"],
            ["label" => "Simpan Pengguna", "route_name" => "pengguna.store", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "api"],
            ["label" => "Lihat Pengguna", "route_name" => "pengguna.show", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "form"],
            ["label" => "Ubah Pengguna", "route_name" => "pengguna.edit", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "form"],
            ["label" => "Simpan Perubahan Pengguna", "route_name" => "pengguna.update", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "api"],
            ["label" => "Hapus Pengguna", "route_name" => "pengguna.destroy", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "api"],
            ["label" => "Kirim Ulang Tautan Verifikasi Pengguna", "route_name" => "pengguna.verify-resend", "icon" => "MailPlus", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "api"],

            ["label" => "Roles", "route_name" => "role.index", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "menu"],
            ["label" => "Tambah Roles", "route_name" => "role.create", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "form"],
            ["label" => "Simpan Roles", "route_name" => "role.store", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "api"],
            ["label" => "Lihat Roles", "route_name" => "role.show", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "form"],
            ["label" => "Ubah Roles", "route_name" => "role.edit", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "form"],
            ["label" => "Simpan Perubahan Roles", "route_name" => "role.update", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "api"],
            ["label" => "Hapus Roles", "route_name" => "role.destroy", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "api"],
            ["label" => "Hapus Roles", "route_name" => "role.destroy", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "api"],

            ["label" => "Role to Menu", "route_name" => "role.mappingmenutorole", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 3, "type" => "form"],
            ["label" => "Simpan Role to Menu", "route_name" => "role.storemappingmenutorole", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 3, "type" => "api"],

            ["label" => "Menu", "route_name" => "menu.index", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "menu"],
            ["label" => "Tambah Menu", "route_name" => "menu.create", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "form"],
            ["label" => "Simpan Menu", "route_name" => "menu.store", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "api"],
            ["label" => "Lihat Menu", "route_name" => "menu.show", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "form"],
            ["label" => "Ubah Menu", "route_name" => "menu.edit", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "form"],
            ["label" => "Ubah Perubahan Menu", "route_name" => "menu.update", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "api"],
            ["label" => "Hapus Menu", "route_name" => "menu.destroy", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "api"],

        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
