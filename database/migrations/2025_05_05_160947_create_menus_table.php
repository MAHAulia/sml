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
            ["label" => "Settings", "route_name" => "settings", "icon" => "Settings", "is_parent" => true, "parent_id" => null, "order_number" => 1, "type" => "menu"],
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
            ["label" => "Marketing", "route_name" => "marketing", "icon" => "Megaphone", "is_parent" => true, "parent_id" => null, "order_number" => 2, "type" => "menu"],
            // 29
            ["label" => "Customer", "route_name" => "customer.index", "icon" => "Users", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "menu"],
            // 30
            ["label" => "Tambah Customer", "route_name" => "customer.create", "icon" => "Users", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "form"],
            // 31
            ["label" => "Simpan Customer", "route_name" => "customer.store", "icon" => "Users", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "api"],
            // 32
            ["label" => "Lihat Customer", "route_name" => "customer.show", "icon" => "Users", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "form"],
            // 33
            ["label" => "Ubah Customer", "route_name" => "customer.edit", "icon" => "Users", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "form"],
            // 34
            ["label" => "Simpan Perubahan Customer", "route_name" => "customer.update", "icon" => "Users", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "api"],
            // 35
            ["label" => "Hapus Customer", "route_name" => "customer.destroy", "icon" => "Users", "is_parent" => false, "parent_id" => 28, "order_number" => 1, "type" => "api"],
            // 36
            ["label" => "Offering", "route_name" => "offering.index", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 2, "type" => "menu"],
            // 37
            ["label" => "Tambah Offering", "route_name" => "offering.create", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 2, "type" => "form"],
            // 38
            ["label" => "Simpan Offering", "route_name" => "offering.store", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 2, "type" => "api"],
            // 39
            ["label" => "Lihat Offering", "route_name" => "offering.show", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 2, "type" => "form"],
            // 40
            ["label" => "Ubah Offering", "route_name" => "offering.edit", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 2, "type" => "form"],
            // 41
            ["label" => "Simpan Perubahan Offering", "route_name" => "offering.update", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 2, "type" => "api"],
            // 42
            ["label" => "Hapus Offering", "route_name" => "offering.destroy", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 28, "order_number" => 2, "type" => "api"],
            // 43
            ["label" => "Request Pickup", "route_name" => "pickup-offering.index", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 3, "type" => "menu"],
            // 44
            ["label" => "Tambah Request Pickup", "route_name" => "pickup-offering.create", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 3, "type" => "form"],
            // 45
            ["label" => "Simpan Request Pickup", "route_name" => "pickup-offering.store", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 3, "type" => "api"],
            // 46
            ["label" => "Lihat Request Pickup", "route_name" => "pickup-offering.show", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 3, "type" => "form"],
            // 47
            ["label" => "Ubah Request Pickup", "route_name" => "pickup-offering.edit", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 3, "type" => "form"],
            // 48
            ["label" => "Simpan Perubahan Request Pickup", "route_name" => "pickup-offering.update", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 3, "type" => "api"],
            // 49
            ["label" => "Hapus Request Pickup", "route_name" => "pickup-offering.destroy", "icon" => "Package", "is_parent" => false, "parent_id" => 28, "order_number" => 3, "type" => "api"],

            // Customer Services
            // 50
            ["label" => "Customer Services", "route_name" => "customer-services", "icon" => "Headset", "is_parent" => true, "parent_id" => null, "order_number" => 3, "type" => "menu"],
            // 51
            ["label" => "Offering Request", "route_name" => "offering-request.index", "icon" => "Megaphone", "is_parent" => false, "parent_id" => 50, "order_number" => 1, "type" => "menu"],
            // 52
            ["label" => "Set Tarif", "route_name" => "offering-price.create", "icon" => "CreditCard", "is_parent" => false, "parent_id" => 50, "order_number" => 1, "type" => "form"],
            // 53
            ["label" => "Simpan Set Tarif", "route_name" => "offering-price.store", "icon" => "CreditCard", "is_parent" => false, "parent_id" => 50, "order_number" => 1, "type" => "api"],
            // 54
            ["label" => "Lihat Set Tarif", "route_name" => "offering-price.show", "icon" => "CreditCard", "is_parent" => false, "parent_id" => 50, "order_number" => 1, "type" => "form"],
            // 55
            ["label" => "Request Pickup", "route_name" => "pickup-request.index", "icon" => "Package", "is_parent" => false, "parent_id" => 50, "order_number" => 2, "type" => "menu"],
            // 56
            ["label" => "Kelola Pickup", "route_name" => "pickup-request.manage", "icon" => "Package", "is_parent" => false, "parent_id" => 50, "order_number" => 2, "type" => "form"],
            // 57
            ["label" => "Simpan Kelola Pickup", "route_name" => "pickup-request.savemanage", "icon" => "Package", "is_parent" => false, "parent_id" => 50, "order_number" => 2, "type" => "api"],
            
            // Pickup
            //58
            ["label" => "Pickup", "route_name" => "pickup", "icon" => "FileBox", "is_parent" => true, "parent_id" => null, "order_number" => 4, "type" => "menu"],
            //59
            ["label" => "Request Pickup", "route_name" => "pickup.index", "icon" => "FileBox", "is_parent" => false, "parent_id" => 58, "order_number" => 1, "type" => "menu"],
            //60
            ["label" => "Show Pickup", "route_name" => "pickup.show", "icon" => "FileBox", "is_parent" => false, "parent_id" => 58, "order_number" => 1, "type" => "form"],
            //61
            ["label" => "Update Pickup", "route_name" => "pickup.update", "icon" => "FileBox", "is_parent" => false, "parent_id" => 58, "order_number" => 1, "type" => "api"],
            //62
            ["label" => "Manifest Serah", "route_name" => "pickup.manifest_serah", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 58, "order_number" => 4, "type" => "menu"],
            //63
            ["label" => "Show Manifest Serah", "route_name" => "pickup.show_manifest_serah", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 58, "order_number" => 5, "type" => "menu"],
            //64
            ["label" => "Buat Menifest Serah", "route_name" => "pickup.create_manifest_serah", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 58, "order_number" => 6, "type" => "form"],
            //65
            ["label" => "Simpan Manifest Serah", "route_name" => "pickup.save_manifest_serah", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 58, "order_number" => 7, "type" => "api"],

            // Warehouse
            //66
            ["label" => "Warehouse", "route_name" => "warehouse", "icon" => "Warehouse", "is_parent" => true, "parent_id" => null, "order_number" => 5, "type" => "menu"],
            //67
            ["label" => "Manifest Terima", "route_name" => "warehouse.manifest_terima", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 66, "order_number" => 1, "type" => "menu"],
            //68
            ["label" => "Show Manifest Terima", "route_name" => "warehouse.show_manifest_terima", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 66, "order_number" => 2, "type" => "menu"],
            //69
            ["label" => "Buat Menifest Terima", "route_name" => "warehouse.create_manifest_terima", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 66, "order_number" => 3, "type" => "form"],
            //70
            ["label" => "Simpan Manifest Terima", "route_name" => "warehouse.save_manifest_terima", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 66, "order_number" => 4, "type" => "api"],
            //71
            ["label" => "Bagging", "route_name" => "warehouse.baging", "icon" => "Boxes", "is_parent" => false, "parent_id" => 66, "order_number" => 5, "type" => "menu"],
            //72
            ["label" => "Lihat Bagging", "route_name" => "warehouse.create_baging", "icon" => "Boxes", "is_parent" => false, "parent_id" => 66, "order_number" => 6, "type" => "form"],
            //73
            ["label" => "Buat Bagging", "route_name" => "warehouse.create_baging", "icon" => "Boxes", "is_parent" => false, "parent_id" => 66, "order_number" => 7, "type" => "form"],
            //74
            ["label" => "Simpan Simpan Bagging", "route_name" => "warehouse.save_baging", "icon" => "Boxes", "is_parent" => false, "parent_id" => 66, "order_number" => 8, "type" => "api"],
            //75
            ["label" => "Manifest Serah", "route_name" => "warehouse.manifest_serah", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 66, "order_number" => 9, "type" => "menu"],
            //76
            ["label" => "Show Manifest Serah", "route_name" => "warehouse.show_manifest_serah", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 66, "order_number" => 10, "type" => "menu"],
            //77
            ["label" => "Buat Menifest Serah", "route_name" => "warehouse.create_manifest_serah", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 66, "order_number" => 11, "type" => "form"],
            //78
            ["label" => "Simpan Manifest Serah", "route_name" => "warehouse.save_manifest_serah", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 66, "order_number" => 12, "type" => "api"],

            // Delivery
            //79
            ["label" => "Delivery", "route_name" => "delivery", "icon" => "Truck", "is_parent" => true, "parent_id" => null, "order_number" => 6, "type" => "menu"],
            //80
            ["label" => "Manifest Terima", "route_name" => "delivery.manifest_terima", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 79, "order_number" => 1, "type" => "menu"],
            //81
            ["label" => "Show Manifest Terima", "route_name" => "delivery.show_manifest_terima", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 79, "order_number" => 2, "type" => "menu"],
            //82
            ["label" => "Buat Menifest Terima", "route_name" => "delivery.create_manifest_terima", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 79, "order_number" => 3, "type" => "form"],
            //83
            ["label" => "Simpan Manifest Terima", "route_name" => "delivery.save_manifest_terima", "icon" => "ListTodo", "is_parent" => false, "parent_id" => 79, "order_number" => 4, "type" => "api"],
            //84
            ["label" => "Delivery Order", "route_name" => "delivery-order.index", "icon" => "Truck", "is_parent" => false, "parent_id" => 79, "order_number" => 5, "type" => "menu"],
            //85
            ["label" => "Create Delivery Order", "route_name" => "delivery-order.create", "icon" => "Truck", "is_parent" => false, "parent_id" => 79, "order_number" => 6, "type" => "form"],
            //86
            ["label" => "Show Delivery Order", "route_name" => "delivery-order.show", "icon" => "Truck", "is_parent" => false, "parent_id" => 79, "order_number" => 7, "type" => "form"],
            //87
            ["label" => "Update Delivery Order", "route_name" => "delivery-order.update", "icon" => "Truck", "is_parent" => false, "parent_id" => 79, "order_number" => 8, "type" => "api"],

            // Accounting
            //88
            ["label" => "Accounting", "route_name" => "accounting", "icon" => "CreditCard", "is_parent" => true, "parent_id" => null, "order_number" => 7, "type" => "menu"],
            //89
            ["label" => "Penawaran Tarif", "route_name" => "tarif.index", "icon" => "Banknote", "is_parent" => false, "parent_id" => 88, "order_number" => 1, "type" => "menu"],
            //90
            ["label" => "Penawaran Tarif", "route_name" => "tarif.create", "icon" => "Banknote", "is_parent" => false, "parent_id" => 88, "order_number" => 2, "type" => "form"],
            //91
            ["label" => "Set Tarif", "route_name" => "tarif.show", "icon" => "Banknote", "is_parent" => false, "parent_id" => 88, "order_number" => 3, "type" => "form"],
            //92
            ["label" => "Invoice", "route_name" => "invoice.index", "icon" => "CreditCard", "is_parent" => false, "parent_id" => 88, "order_number" => 4, "type" => "menu"],
            //93
            ["label" => "Create Invoice", "route_name" => "invoice.create", "icon" => "CreditCard", "is_parent" => false, "parent_id" => 88, "order_number" => 5, "type" => "form"],
            //94
            ["label" => "Show Invoice", "route_name" => "invoice.show", "icon" => "CreditCard", "is_parent" => false, "parent_id" => 88, "order_number" => 6, "type" => "form"],
            //95
            ["label" => "Update Invoice", "route_name" => "invoice.update", "icon" => "CreditCard", "is_parent" => false, "parent_id" => 88, "order_number" => 7, "type" => "api"],
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
