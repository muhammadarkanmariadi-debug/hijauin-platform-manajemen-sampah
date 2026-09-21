<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * @see docs/SCHEMA.md §kategori_sampah
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kategori_sampah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained('bank_sampah_units')->cascadeOnDelete();
            $table->string('nama');
            $table->string('jenis'); // JenisSampah enum: plastik, kertas, logam, kaca
            $table->decimal('harga_per_kg', 10, 2)->default(0);
            $table->integer('poin_per_kg')->default(0);
            $table->text('deskripsi')->nullable();
            $table->string('foto_url')->nullable();
            $table->timestamps();

            $table->index('unit_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kategori_sampah');
    }
};
