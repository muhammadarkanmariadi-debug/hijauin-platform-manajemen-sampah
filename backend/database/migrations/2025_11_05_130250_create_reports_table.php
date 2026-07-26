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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('report_number', 50)->unique();
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
            $table->string('title', 200);
            $table->text('description');
            $table->text('photo_url'); // bisa JSON array untuk multiple photos
            $table->text('location_address');
            $table->string('kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('city', 100);
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed'])->default('open');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('assigned_at')->nullable();
            $table->dateTime('resolved_at')->nullable();
            $table->text('resolution_photo')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->integer('points_awarded')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'priority']);
            $table->index(['reporter_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
