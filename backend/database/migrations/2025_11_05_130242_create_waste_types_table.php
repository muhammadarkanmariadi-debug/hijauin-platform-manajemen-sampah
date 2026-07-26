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
        Schema::create('waste_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100); // organik, anorganik, e-waste, besar
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->decimal('base_price_per_kg', 10, 2)->default(0); // harga per kg
            $table->integer('points_per_kg')->default(0); // poin per kg
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waste_types');
    }
};
