<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Junction table: user ↔ role, optionally scoped to a unit.
 *
 * - Nasabah/Admin: unit_id is set
 * - platform_ops (future): unit_id is NULL (global scope)
 *
 * @see docs/SCHEMA.md §user_roles
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignId('unit_id')->nullable()->constrained('bank_sampah_units')->nullOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'role_id', 'unit_id']);
            $table->index('user_id');
            $table->index('unit_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_roles');
    }
};
