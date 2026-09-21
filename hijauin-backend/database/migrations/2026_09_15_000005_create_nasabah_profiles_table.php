<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * @see docs/SCHEMA.md §nasabah_profiles
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nasabah_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('unit_id')->constrained('bank_sampah_units')->cascadeOnDelete();
            $table->text('alamat')->nullable();
            $table->integer('saldo_poin')->default(0);
            $table->timestamps();

            $table->unique('user_id'); // One profile per user
            $table->index('unit_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nasabah_profiles');
    }
};
