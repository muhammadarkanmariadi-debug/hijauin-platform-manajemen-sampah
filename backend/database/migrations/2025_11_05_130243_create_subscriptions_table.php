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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('subscription_number', 50)->unique();
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('address_id')->constrained()->onDelete('cascade');
            $table->foreignId('waste_type_id')->constrained()->onDelete('cascade');
            $table->enum('plan_type', ['weekly_2x', 'weekly_3x', 'daily', 'custom'])->default('weekly_2x');
            $table->integer('pickups_per_week')->default(2);
            $table->json('pickup_days'); // [1,3,5] => Monday, Wednesday, Friday
            $table->time('preferred_time');
            $table->decimal('estimated_weight_per_pickup', 8, 2);
            $table->decimal('monthly_price', 10, 2);
            $table->enum('payment_method', ['auto_debit', 'monthly_invoice'])->default('monthly_invoice');
            $table->enum('status', ['active', 'paused', 'cancelled', 'expired'])->default('active');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('next_pickup_date')->nullable();
            $table->date('paused_until')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['customer_id', 'status']);
            $table->index(['status', 'next_pickup_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
