<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * The tenant entity — a physical waste-bank branch.
 *
 * @see docs/SCHEMA.md §bank_sampah_units
 */
class BankSampahUnit extends Model
{
    use HasFactory;

    protected $table = 'bank_sampah_units';

    protected $fillable = [
        'nama',
        'alamat',
        'telepon',
        'deskripsi',
    ];

    public function userRoles(): HasMany
    {
        return $this->hasMany(UserRole::class, 'unit_id');
    }

    public function nasabahProfiles(): HasMany
    {
        return $this->hasMany(NasabahProfile::class, 'unit_id');
    }

    public function kategoriSampahs(): HasMany
    {
        return $this->hasMany(KategoriSampah::class, 'unit_id');
    }

    public function hadiahs(): HasMany
    {
        return $this->hasMany(Hadiah::class, 'unit_id');
    }
}
