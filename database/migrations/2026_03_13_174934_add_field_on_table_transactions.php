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
            $table->enum("status", ["pending", "on_review", "price_set", "on_nego","on_review_nego", "accepted", "rejected"])->default("pending")->after('catatan');
            $table->enum("pickup_status", ["null","request", "on_pickup", "success_pickup", "failed_pickup"])->default("null")->after('catatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // $table->dropColumn("pickuper_id");
            // $table->dropColumn("status");
            // $table->dropColumn("pickup_status");
        });
    }
};
