<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Reward/voucher catalog, scoped per unit.
 * stok must be decremented transactionally on redemption (TRD §3).
 *
 * @see docs/SCHEMA.md §hadiah
 */
class Hadiah extends Model
{
    use HasFactory;

    protected $table = 'hadiah';

    protected $fillable = [
        'unit_id',
        'nama',
        'deskripsi',
        'poin_diperlukan',
        'stok',
        'foto_url',
    ];

    protected function casts(): array
    {
        return [
            'poin_diperlukan' => 'integer',
            'stok' => 'integer',
        ];
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(BankSampahUnit::class, 'unit_id');
    }

    public function penukaranPoins(): HasMany
    {
        return $this->hasMany(PenukaranPoin::class, 'hadiah_id');
    }
}
