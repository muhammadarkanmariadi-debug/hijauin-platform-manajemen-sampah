<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HijauPoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pointable_type',
        'pointable_id',
        'points',
        'type',
        'description',
        'expires_at',
    ];

    protected $casts = [
        'points' => 'integer',
        'expires_at' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pointable()
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopeEarned($query)
    {
        return $query->where('type', 'earned');
    }

    public function scopeRedeemed($query)
    {
        return $query->where('type', 'redeemed');
    }

    public function scopeExpired($query)
    {
        return $query->where('type', 'expired');
    }

    public function scopeActive($query)
    {
        return $query->where('type', 'earned')
                     ->where(function($q) {
                         $q->whereNull('expires_at')
                           ->orWhere('expires_at', '>', now());
                     });
    }

    // Methods
    public static function getTotalEarnedPoints($userId)
    {
        return static::where('user_id', $userId)
                     ->where('type', 'earned')
                     ->sum('points');
    }

    public static function getTotalRedeemedPoints($userId)
    {
        return static::where('user_id', $userId)
                     ->where('type', 'redeemed')
                     ->sum('points');
    }

    public static function getAvailablePoints($userId)
    {
        $earned = static::where('user_id', $userId)
                       ->where('type', 'earned')
                       ->active()
                       ->sum('points');

        $redeemed = static::where('user_id', $userId)
                          ->where('type', 'redeemed')
                          ->sum('points');

        return abs($earned + $redeemed); // redeemed is negative
    }
}
