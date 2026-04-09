<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('bag_id')->nullable()->constrained('bags')->noActionOnDelete();
            $table->foreignId('manifest_id')->nullable()->constrained('manifests')->noActionOnDelete();
            $table->enum("shipment_status", ["on_hold", "bagged", "manifested", "uplifted", "in_transit", "arrived", "incomplete", "delivered"])->default("on_hold");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            //
        });
    }
};
