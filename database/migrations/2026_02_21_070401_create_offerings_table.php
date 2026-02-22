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
        Schema::create('offerings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->noActionOnDelete();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->noActionOnDelete();
            $table->foreignId('biaya_id')->nullable()->constrained('biayas')->noActionOnDelete();
            $table->string("senderName");
            $table->string("senderPhone");
            $table->string("senderAddress");
            $table->string("receiverName");
            $table->string("receiverPhone");
            $table->string("receiverAddress");
            $table->double("total_item");
            $table->double("p")->nullable();
            $table->double("l")->nullable();
            $table->double("t")->nullable();
            $table->double("weight");
            $table->string("isiKiriman");
            $table->string("catatan")->nullable();
            $table->enum("status", ["pending", "on_review", "price_set", "on_nego", "accepted", "rejected"])->default("pending");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offerings');
    }
};
