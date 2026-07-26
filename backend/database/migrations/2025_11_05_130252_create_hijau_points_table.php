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
        Schema::create('hijau_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->morphs('pointable'); // order_id atau report_id
            $table->integer('points');
            $table->enum('type', ['earned', 'redeemed', 'expired', 'bonus'])->default('earned');
            $table->text('description');
            $table->date('expires_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'type']);
      
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hijau_points');
    }
};
