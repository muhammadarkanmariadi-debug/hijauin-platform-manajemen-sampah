<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Nasabah-specific profile. Person-level fields (name, phone, photo)
 * live on users — this holds only role-specific data.
 *
 * @see docs/SCHEMA.md §nasabah_profiles
 */
class NasabahProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'unit_id',
        'alamat',
        'saldo_poin',
    ];

    protected function casts(): array
    {
        return [
            'saldo_poin' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(BankSampahUnit::class, 'unit_id');
    }

    public function setorSampahs(): HasMany
    {
        return $this->hasMany(SetorSampah::class, 'nasabah_profile_id');
    }

    public function penukaranPoins(): HasMany
    {
        return $this->hasMany(PenukaranPoin::class, 'nasabah_profile_id');
    }
}
