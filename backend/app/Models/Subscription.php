<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'subscription_number',
        'customer_id',
        'address_id',
        'waste_type_id',
        'plan_type',
        'pickups_per_week',
        'pickup_days',
        'preferred_time',
        'estimated_weight_per_pickup',
        'monthly_price',
        'payment_method',
        'status',
        'start_date',
        'end_date',
        'next_pickup_date',
        'paused_until',
        'cancellation_reason',
    ];

    protected $casts = [
        'pickup_days' => 'array',
        'pickups_per_week' => 'integer',
        'estimated_weight_per_pickup' => 'decimal:2',
        'monthly_price' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'next_pickup_date' => 'date',
        'paused_until' => 'date',
    ];

    // Auto-generate subscription number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($subscription) {
            if (empty($subscription->subscription_number)) {
                $subscription->subscription_number = 'SUB-' . Carbon::now()->format('Ymd') . '-' . str_pad(static::whereDate('created_at', Carbon::today())->count() + 1, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    // Relationships
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function wasteType()
    {
        return $this->belongsTo(WasteType::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function paymentTransactions()
    {
        return $this->morphMany(PaymentTransaction::class, 'payable');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopePaused($query)
    {
        return $query->where('status', 'paused');
    }

    public function scopeDueForPickup($query)
    {
        return $query->where('status', 'active')
                     ->whereDate('next_pickup_date', '<=', Carbon::today());
    }

    // Methods
    public function pause($until = null)
    {
        $this->update([
            'status' => 'paused',
            'paused_until' => $until,
        ]);
    }

    public function resume()
    {
        $this->update([
            'status' => 'active',
            'paused_until' => null,
        ]);

        $this->calculateNextPickupDate();
    }

    public function cancel($reason = null)
    {
        $this->update([
            'status' => 'cancelled',
            'end_date' => Carbon::now(),
            'cancellation_reason' => $reason,
        ]);
    }

    public function calculateNextPickupDate()
    {
        $today = Carbon::now();
        $pickupDays = $this->pickup_days;

        // Find next pickup day
        $nextPickup = null;
        for ($i = 0; $i < 7; $i++) {
            $checkDate = $today->copy()->addDays($i);
            $dayOfWeek = $checkDate->dayOfWeek; // 0 = Sunday, 1 = Monday, etc.

            if (in_array($dayOfWeek, $pickupDays)) {
                $nextPickup = $checkDate;
                break;
            }
        }

        if ($nextPickup) {
            $this->update(['next_pickup_date' => $nextPickup->format('Y-m-d')]);
        }

        return $nextPickup;
    }

    public function createOrderForPickup()
    {
        $wasteType = $this->wasteType;
        $price = $wasteType->calculatePrice($this->estimated_weight_per_pickup);
        $points = $wasteType->calculatePoints($this->estimated_weight_per_pickup);

        $order = Order::create([
            'customer_id' => $this->customer_id,
            'address_id' => $this->address_id,
            'waste_type_id' => $this->waste_type_id,
            'estimated_weight_kg' => $this->estimated_weight_per_pickup,
            'scheduled_time' => Carbon::parse($this->next_pickup_date)->setTimeFromTimeString($this->preferred_time),
            'price' => $price,
            'points_awarded' => $points,
            'payment_method' => $this->payment_method === 'auto_debit' ? 'ewallet' : 'cod',
            'subscription_id' => $this->id,
        ]);

        // Calculate next pickup date
        $this->calculateNextPickupDate();

        return $order;
    }
}
