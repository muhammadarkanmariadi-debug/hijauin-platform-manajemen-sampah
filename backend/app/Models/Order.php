<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_number',
        'customer_id',
        'address_id',
        'waste_type_id',
        'estimated_weight_kg',
        'estimated_volume',
        'scheduled_time',
        'status',
        'assigned_petugas_id',
        'assigned_at',
        'started_at',
        'completed_at',
        'actual_weight_kg',
        'price',
        'points_awarded',
        'payment_method',
        'payment_status',
        'customer_notes',
        'petugas_notes',
        'pickup_photo',
        'failed_reason',
        'subscription_id',
    ];

    protected $casts = [
        'estimated_weight_kg' => 'decimal:2',
        'actual_weight_kg' => 'decimal:2',
        'price' => 'decimal:2',
        'points_awarded' => 'integer',
        'estimated_volume' => 'integer',
        'scheduled_time' => 'datetime',
        'assigned_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Auto-generate order number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . Carbon::now()->format('Ymd') . '-' . str_pad(static::whereDate('created_at', Carbon::today())->count() + 1, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    // Relationships
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function assignedPetugas()
    {
        return $this->belongsTo(User::class, 'assigned_petugas_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function wasteType()
    {
        return $this->belongsTo(WasteType::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function paymentTransactions()
    {
        return $this->morphMany(PaymentTransaction::class, 'payable');
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    public function hijauPoints()
    {
        return $this->morphMany(HijauPoint::class, 'pointable');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAssigned($query)
    {
        return $query->where('status', 'assigned');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeToday($query)
    {
        return $query->whereDate('scheduled_time', Carbon::today());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_time', '>', Carbon::now());
    }

    // Methods
    public function assignToPetugas($petugasId)
    {
        $this->update([
            'assigned_petugas_id' => $petugasId,
            'status' => 'assigned',
            'assigned_at' => Carbon::now(),
        ]);
    }

    public function markAsOnTheWay()
    {
        $this->update([
            'status' => 'on_the_way',
            'started_at' => Carbon::now(),
        ]);
    }

    public function markAsCollected($actualWeight = null, $photo = null)
    {
        $data = [
            'status' => 'collected',
        ];

        if ($actualWeight) {
            $data['actual_weight_kg'] = $actualWeight;
        }

        if ($photo) {
            $data['pickup_photo'] = $photo;
        }

        $this->update($data);
    }

    public function markAsCompleted()
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => Carbon::now(),
            'payment_status' => $this->payment_method === 'cod' ? 'paid' : $this->payment_status,
        ]);

        // Award points
        if ($this->points_awarded > 0) {
            $this->customer->addPoints(
                $this->points_awarded,
                "Pickup order {$this->order_number}",
                Order::class,
                $this->id
            );
        }
    }

    public function markAsFailed($reason)
    {
        $this->update([
            'status' => 'failed',
            'failed_reason' => $reason,
        ]);
    }

    public function canBeReviewed()
    {
        return $this->status === 'completed' && !$this->review;
    }
}
