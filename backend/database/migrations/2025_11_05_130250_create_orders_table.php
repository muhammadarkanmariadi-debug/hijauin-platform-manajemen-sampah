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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('address_id')->constrained()->onDelete('cascade');
            $table->foreignId('waste_type_id')->constrained()->onDelete('cascade');
            $table->decimal('estimated_weight_kg', 8, 2);
            $table->integer('estimated_volume')->nullable(); // jumlah karung
            $table->dateTime('scheduled_time');
            $table->enum('status', ['pending', 'assigned', 'on_the_way', 'collected', 'completed', 'cancelled', 'failed'])->default('pending');
            $table->foreignId('assigned_petugas_id')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('assigned_at')->nullable();
            $table->dateTime('started_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->decimal('actual_weight_kg', 8, 2)->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('points_awarded')->default(0);
            $table->enum('payment_method', ['cash', 'ewallet', 'transfer', 'cod'])->default('cod');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->text('customer_notes')->nullable();
            $table->text('petugas_notes')->nullable();
            $table->text('pickup_photo')->nullable(); // bukti foto
            $table->text('failed_reason')->nullable();
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'scheduled_time']);
            $table->index(['customer_id', 'status']);
            $table->index(['assigned_petugas_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
