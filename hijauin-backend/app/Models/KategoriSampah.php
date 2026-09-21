<?php

namespace App\Models;

use App\Enums\JenisSampah;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Waste material category, scoped per unit.
 * jenis is a fixed enum — extend via migration, not free-text.
 *
 * @see docs/SCHEMA.md §kategori_sampah
 */
class KategoriSampah extends Model
{
    use HasFactory;

    protected $table = 'kategori_sampah';

    protected $fillable = [
        'unit_id',
        'nama',
        'jenis',
        'harga_per_kg',
        'poin_per_kg',
        'deskripsi',
        'foto_url',
    ];

    protected function casts(): array
    {
        return [
            'jenis' => JenisSampah::class,
            'harga_per_kg' => 'decimal:2',
            'poin_per_kg' => 'integer',
        ];
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(BankSampahUnit::class, 'unit_id');
    }

    public function detailSetors(): HasMany
    {
        return $this->hasMany(DetailSetor::class, 'kategori_sampah_id');
    }
}
