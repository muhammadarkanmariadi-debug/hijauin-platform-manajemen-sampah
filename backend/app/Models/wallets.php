<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class wallets extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'currency',
        'balance',
        'type',
        'is_active'
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
