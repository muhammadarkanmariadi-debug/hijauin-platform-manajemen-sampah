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
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number', 50)->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->morphs('payable'); // order_id atau subscription_id
            $table->decimal('amount', 10, 2);
            $table->enum('type', ['order', 'subscription', 'refund', 'payout'])->default('order');
            $table->enum('method', ['cash', 'ewallet', 'transfer', 'cod', 'auto_debit'])->default('cash');
            $table->enum('status', ['pending', 'processing', 'success', 'failed', 'refunded'])->default('pending');
            $table->string('payment_gateway')->nullable(); // midtrans, xendit, dll
            $table->string('gateway_transaction_id')->nullable();
            $table->text('gateway_response')->nullable(); // JSON response dari gateway
            $table->dateTime('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
    
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
