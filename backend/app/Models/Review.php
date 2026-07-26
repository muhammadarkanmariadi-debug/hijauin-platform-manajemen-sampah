<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'customer_id',
        'petugas_id',
        'rating',
        'comment',
        'service_aspect',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function petugas()
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    // Scopes
    public function scopeHighRated($query, $minRating = 4)
    {
        return $query->where('rating', '>=', $minRating);
    }

    public function scopeLowRated($query, $maxRating = 2)
    {
        return $query->where('rating', '<=', $maxRating);
    }

    // Methods
    public static function getAverageRatingForPetugas($petugasId)
    {
        return static::where('petugas_id', $petugasId)->avg('rating');
    }

    public static function getTotalReviewsForPetugas($petugasId)
    {
        return static::where('petugas_id', $petugasId)->count();
    }
}
