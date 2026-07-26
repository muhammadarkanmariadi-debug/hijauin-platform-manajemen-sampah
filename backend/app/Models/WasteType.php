<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class WasteType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'base_price_per_kg',
        'points_per_kg',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'base_price_per_kg' => 'decimal:2',
        'points_per_kg' => 'integer',
        'is_active' => 'boolean',
    ];

    // Auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($wasteType) {
            if (empty($wasteType->slug)) {
                $wasteType->slug = Str::slug($wasteType->name);
            }
        });
    }

    // Relationships
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Methods
    public function calculatePrice($weightKg)
    {
        return $this->base_price_per_kg * $weightKg;
    }

    public function calculatePoints($weightKg)
    {
        return (int) ($this->points_per_kg * $weightKg);
    }
}
