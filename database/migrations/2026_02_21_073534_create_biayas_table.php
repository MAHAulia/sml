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
        Schema::create('biayas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offering_id')->constrained('offerings')->noActionOnDelete();
            $table->foreignId('transaction_id')->nullable()->constrained('transactions')->noActionOnDelete();
            $table->foreignId('user_id')->constrained('users')->noActionOnDelete();
            $table->double("base_price");
            $table->double("offering_price");
            $table->double("deal_price")->nullable();
            $table->double("nego_price")->nullable();
            $table->enum("status", ["pending", "on_nego", "accepted", "rejected"])->default("pending");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biayas');
    }
};
