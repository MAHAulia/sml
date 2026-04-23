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
        Schema::table('bag_details', function (Blueprint $table) {
            $table->enum("status", ["created", "bagged", "manifested", "received"])->default("created")->after("transaction_id");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bag_details', function (Blueprint $table) {
            //
        });
    }
};
