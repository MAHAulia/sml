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
        Schema::create('surat_jalans', function (Blueprint $table) {
            $table->id();
            $table->string("code");
            $table->enum("status", ["created", "sending", "arrived"])->default("created");
            $table->foreignId('user_id')->constrained('users')->noActionOnDelete();
            $table->foreignId('mobil_id')->constrained('mobils')->noActionOnDelete();
            $table->string("nopol");
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
        Schema::dropIfExists('surat_jalans');
    }
};
