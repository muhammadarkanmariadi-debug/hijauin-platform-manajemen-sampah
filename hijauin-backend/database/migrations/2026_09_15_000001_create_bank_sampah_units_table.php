<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * bank_sampah_units must be created before user_roles and other
 * unit-scoped tables (FK dependency).
 *
 * @see docs/SCHEMA.md §bank_sampah_units
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bank_sampah_units', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->text('alamat')->nullable();
            $table->string('telepon')->nullable();
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_sampah_units');
    }
};
