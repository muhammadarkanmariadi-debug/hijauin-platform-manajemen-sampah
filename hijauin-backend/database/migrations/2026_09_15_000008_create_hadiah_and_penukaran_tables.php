<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * @see docs/SCHEMA.md §hadiah, §penukaran_poin
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hadiah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained('bank_sampah_units')->cascadeOnDelete();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->integer('poin_diperlukan');
            $table->integer('stok')->default(0);
            $table->string('foto_url')->nullable();
            $table->timestamps();

            $table->index('unit_id');
        });

        Schema::create('penukaran_poin', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nasabah_profile_id')->constrained('nasabah_profiles')->cascadeOnDelete();
            $table->foreignId('hadiah_id')->constrained('hadiah')->cascadeOnDelete();
            $table->integer('poin_ditukar');
            $table->string('status')->default('diproses');
            $table->string('idempotency_key')->unique(); // Prevents double-redemption (TRD §3)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penukaran_poin');
        Schema::dropIfExists('hadiah');
    }
};
