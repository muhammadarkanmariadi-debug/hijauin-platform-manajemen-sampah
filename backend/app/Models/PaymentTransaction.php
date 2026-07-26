<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class PaymentTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_number',
        'user_id',
        'payable_type',
        'payable_id',
        'amount',
        'type',
        'method',
        'status',
        'payment_gateway',
        'gateway_transaction_id',
        'gateway_response',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    // Auto-generate transaction number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            if (empty($transaction->transaction_number)) {
                $transaction->transaction_number = 'TRX-' . Carbon::now()->format('YmdHis') . '-' . str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
            }
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payable()
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSuccess($query)
    {
        return $query->where('status', 'success');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    // Methods
    public function markAsPaid()
    {
        $this->update([
            'status' => 'success',
            'paid_at' => Carbon::now(),
        ]);

        // Update related payable status
        if ($this->payable_type === Order::class) {
            $this->payable->update(['payment_status' => 'paid']);
        }
    }

    public function markAsFailed($reason = null)
    {
        $this->update([
            'status' => 'failed',
            'notes' => $reason,
        ]);

        // Update related payable status
        if ($this->payable_type === Order::class) {
            $this->payable->update(['payment_status' => 'failed']);
        }
    }
}
