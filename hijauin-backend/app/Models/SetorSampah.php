<?php

namespace App\Models;

use App\Enums\StatusSetoran;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Submission header — status, dates, notes, and verifier.
 * Line items live in detail_setor.
 *
 * @see docs/SCHEMA.md §setor_sampah
 */
class SetorSampah extends Model
{
    use HasFactory;

    protected $table = 'setor_sampah';

    protected $fillable = [
        'nasabah_profile_id',
        'tanggal',
        'status',
        'catatan',
        'verified_by_user_id',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => StatusSetoran::class,
            'tanggal' => 'date',
            'verified_at' => 'datetime',
        ];
    }

    public function nasabahProfile(): BelongsTo
    {
        return $this->belongsTo(NasabahProfile::class, 'nasabah_profile_id');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by_user_id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(DetailSetor::class, 'setor_sampah_id');
    }
}
