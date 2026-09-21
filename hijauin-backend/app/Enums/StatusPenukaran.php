<?php

namespace App\Enums;

/**
 * Canonical status enum for penukaran_poin.
 *
 * @see docs/SCHEMA.md §penukaran_poin
 */
enum StatusPenukaran: string
{
    case Diproses = 'diproses';
    case Selesai = 'selesai';
    case Dibatalkan = 'dibatalkan';
}
