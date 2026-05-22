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
        Schema::create('track_and_traces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offering_id')->constrained('offerings')->noActionOnDelete();
            $table->foreignId('transaction_id')->constrained('transactions')->nullable()->noActionOnDelete();
            $table->string('tracking_number')->nullable()->unique();
            $table->string('status');
            $table->string('location')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('track_and_traces');
    }
};
