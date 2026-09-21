<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Line item in a waste submission.
 *
 * berat_kg_estimasi is set at submission time (for nasabah UI).
 * berat_kg_real and subtotal_poin are NULL until admin verifies.
 * Do NOT compute subtotal_poin at submission — see AGENT.md rule #3.
 *
 * @see docs/SCHEMA.md §detail_setor
 */
class DetailSetor extends Model
{
    use HasFactory;

    protected $table = 'detail_setor';

    protected $fillable = [
        'setor_sampah_id',
        'kategori_sampah_id',
        'berat_kg_estimasi',
        'berat_kg_real',
        'subtotal_poin',
    ];

    protected function casts(): array
    {
        return [
            'berat_kg_estimasi' => 'decimal:2',
            'berat_kg_real' => 'decimal:2',
            'subtotal_poin' => 'integer',
        ];
    }

    public function setorSampah(): BelongsTo
    {
        return $this->belongsTo(SetorSampah::class, 'setor_sampah_id');
    }

    public function kategoriSampah(): BelongsTo
    {
        return $this->belongsTo(KategoriSampah::class, 'kategori_sampah_id');
    }
}
