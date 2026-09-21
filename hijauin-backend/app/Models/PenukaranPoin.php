<?php

namespace App\Models;

use App\Enums\StatusPenukaran;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Redemption transaction.
 * idempotency_key prevents double-redemption on client retry (TRD §3).
 *
 * @see docs/SCHEMA.md §penukaran_poin
 */
class PenukaranPoin extends Model
{
    use HasFactory;

    protected $table = 'penukaran_poin';

    protected $fillable = [
        'nasabah_profile_id',
        'hadiah_id',
        'poin_ditukar',
        'status',
        'idempotency_key',
    ];

    protected function casts(): array
    {
        return [
            'status' => StatusPenukaran::class,
            'poin_ditukar' => 'integer',
        ];
    }

    public function nasabahProfile(): BelongsTo
    {
        return $this->belongsTo(NasabahProfile::class, 'nasabah_profile_id');
    }

    public function hadiah(): BelongsTo
    {
        return $this->belongsTo(Hadiah::class, 'hadiah_id');
    }
}
