<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * @see docs/SCHEMA.md §setor_sampah, §detail_setor
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('setor_sampah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nasabah_profile_id')->constrained('nasabah_profiles')->cascadeOnDelete();
            $table->date('tanggal');
            $table->string('status')->default('menunggu_konfirmasi');
            $table->text('catatan')->nullable();
            $table->foreignId('verified_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });

        Schema::create('detail_setor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('setor_sampah_id')->constrained('setor_sampah')->cascadeOnDelete();
            $table->foreignId('kategori_sampah_id')->constrained('kategori_sampah')->cascadeOnDelete();
            $table->decimal('berat_kg_estimasi', 10, 2);       // Set at submission
            $table->decimal('berat_kg_real', 10, 2)->nullable(); // Set at verification only
            $table->integer('subtotal_poin')->nullable();        // Set at verification only — AGENT.md rule #3
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_setor');
        Schema::dropIfExists('setor_sampah');
    }
};
