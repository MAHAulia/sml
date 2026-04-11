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
        Schema::create('manifests', function (Blueprint $table) {
            $table->id();
            $table->string("code")->unique();
            $table->foreignId('user_id')->constrained('users')->noActionOnDelete();
            $table->string("from");
            $table->string("to");
            $table->string("office_from");
            $table->string("office_to");
            $table->enum("type", ["local", "linehaul"])->default("local");
            $table->enum("status", ["created", "send", "received", "rejected"])->default("created");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('manifests');
    }
};
