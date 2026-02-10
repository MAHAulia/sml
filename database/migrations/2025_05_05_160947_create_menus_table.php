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
            // 1
            ["label" => "Dashboard", "route_name" => "dashboard", "icon" => "LayoutGrid", "is_parent" => true, "parent_id" => null, "order_number" => 1, "type" => "menu"],

            // 2
            ["label" => "Settings", "route_name" => "", "icon" => "Settings", "is_parent" => true, "parent_id" => null, "order_number" => 1, "type" => "menu"],

            // 3
            ["label" => "Pengguna", "route_name" => "pengguna.index", "icon" => "Settings", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "menu"],
            // 4
            ["label" => "Tambah Pengguna", "route_name" => "pengguna.create", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "form"],
            // 5
            ["label" => "Simpan Pengguna", "route_name" => "pengguna.store", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "api"],
            // 6
            ["label" => "Lihat Pengguna", "route_name" => "pengguna.show", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "form"],
            // 7
            ["label" => "Ubah Pengguna", "route_name" => "pengguna.edit", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "form"],
            // 8
            ["label" => "Simpan Perubahan Pengguna", "route_name" => "pengguna.update", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "api"],
            // 9
            ["label" => "Hapus Pengguna", "route_name" => "pengguna.destroy", "icon" => "Users", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "api"],
            // 10
            ["label" => "Kirim Ulang Tautan Verifikasi Pengguna", "route_name" => "pengguna.verify-resend", "icon" => "MailPlus", "is_parent" => false, "parent_id" => 2, "order_number" => 1, "type" => "api"],

            // 11
            ["label" => "Roles", "route_name" => "role.index", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "menu"],
            // 12
            ["label" => "Tambah Roles", "route_name" => "role.create", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "form"],
            // 13
            ["label" => "Simpan Roles", "route_name" => "role.store", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "api"],
            // 14
            ["label" => "Lihat Roles", "route_name" => "role.show", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "form"],
            // 15
            ["label" => "Ubah Roles", "route_name" => "role.edit", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "form"],
            // 16
            ["label" => "Simpan Perubahan Roles", "route_name" => "role.update", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "api"],
            // 17
            ["label" => "Hapus Roles", "route_name" => "role.destroy", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "api"],
            // 18
            ["label" => "Hapus Roles", "route_name" => "role.destroy", "icon" => "FileKey2", "is_parent" => false, "parent_id" => 2, "order_number" => 2, "type" => "api"],

            // 19
            ["label" => "Role to Menu", "route_name" => "role.mappingmenutorole", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 3, "type" => "form"],
            // 20
            ["label" => "Simpan Role to Menu", "route_name" => "role.storemappingmenutorole", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 3, "type" => "api"],

            // 21
            ["label" => "Menu", "route_name" => "menu.index", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "menu"],
            // 22
            ["label" => "Tambah Menu", "route_name" => "menu.create", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "form"],
            // 23
            ["label" => "Simpan Menu", "route_name" => "menu.store", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "api"],
            // 24
            ["label" => "Lihat Menu", "route_name" => "menu.show", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "form"],
            // 25
            ["label" => "Ubah Menu", "route_name" => "menu.edit", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "form"],
            // 26
            ["label" => "Ubah Perubahan Menu", "route_name" => "menu.update", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "api"],
            // 27
            ["label" => "Hapus Menu", "route_name" => "menu.destroy", "icon" => "RectangleEllipsis", "is_parent" => false, "parent_id" => 2, "order_number" => 4, "type" => "api"],

            // Marketing
            // 28
            ["label" => "Marketing", "route_name" => "", "icon" => "Megaphone", "is_parent" => true, "parent_id" => null, "order_number" => 2, "type" => "menu"],
            // 29
            ["label" => "Offering", "route_name" => "offering.index", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "menu"],
            // 30
            ["label" => "Tambah Offering", "route_name" => "offering.create", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "form"],
            // 31
            ["label" => "Simpan Offering", "route_name" => "offering.store", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "api"],
            // 32
            ["label" => "Lihat Offering", "route_name" => "offering.show", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "form"],
            // 33
            ["label" => "Ubah Offering", "route_name" => "offering.edit", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "form"],
            // 34
            ["label" => "Simpan Perubahan Offering", "route_name" => "offering.update", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "api"],
            // 35
            ["label" => "Hapus Offering", "route_name" => "offering.destroy", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "api"],
            // 36
            ["label" => "Request Pickup", "route_name" => "pickup.index", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "menu"],
            // 37
            ["label" => "Tambah Request Pickup", "route_name" => "pickup.create", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "form"],
            // 38
            ["label" => "Simpan Request Pickup", "route_name" => "pickup.store", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "api"],
            // 39
            ["label" => "Lihat Request Pickup", "route_name" => "pickup.show", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "form"],
            // 40
            ["label" => "Ubah Request Pickup", "route_name" => "pickup.edit", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "form"],
            // 41
            ["label" => "Simpan Perubahan Request Pickup", "route_name" => "pickup.update", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "api"],
            // 42
            ["label" => "Hapus Request Pickup", "route_name" => "pickup.destroy", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "api"],

            // Customer Services
            // 43
            ["label" => "Customer Services", "route_name" => "", "icon" => "Headset", "is_parent" => true, "parent_id" => null, "order_number" => 3, "type" => "menu"],
            // 44
            ["label" => "Offering", "route_name" => "offering.index", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 43, "order_number" => 1, "type" => "menu"],
            // 45
            ["label" => "Set Tarif", "route_name" => "offering-price.create", "icon" => "CreditCard", "is_parent" => false, "parent_id" => 43, "order_number" => 2, "type" => "form"],
            // 46
            ["label" => "Simpan Set Tarif", "route_name" => "offering-price.store", "icon" => "CreditCard", "is_parent" => false, "parent_id" => 43, "order_number" => 2, "type" => "api"],
            // 47
            ["label" => "Lihat Set Tarif", "route_name" => "offering-price.show", "icon" => "CreditCard", "is_parent" => false, "parent_id" => 43, "order_number" => 2, "type" => "form"],
            // 48
            ["label" => "Request Pickup", "route_name" => "pickup.index", "icon" => "Package", "is_parent" => false, "parent_id" => 43, "order_number" => 3, "type" => "menu"],
            // 49
            ["label" => "Kelola Pickup", "route_name" => "pickup.manage", "icon" => "Package", "is_parent" => false, "parent_id" => 43, "order_number" => 3, "type" => "form"],
            // 50
            ["label" => "Simpan Kelola Pickup", "route_name" => "pickup.savemanage", "icon" => "Package", "is_parent" => false, "parent_id" => 43, "order_number" => 3, "type" => "api"],
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
