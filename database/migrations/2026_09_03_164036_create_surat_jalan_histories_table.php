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
        Schema::create('surat_jalan_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surat_jalan_id')->constrained('surat_jalans')->noActionOnDelete();
            $table->foreignId('user_id')->constrained('users')->noActionOnDelete();
            $table->enum("status", ["created", "sending", "arrived"])->default("created");
            $table->string("nopol");
            $table->foreignId('mobil_id')->constrained('mobils')->noActionOnDelete();
            $table->foreignId('driver_id')
                ->nullable()
                ->constrained('users')
                ->noActionOnDelete()
                ->after('user_id');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_jalan_histories');
    }
};
