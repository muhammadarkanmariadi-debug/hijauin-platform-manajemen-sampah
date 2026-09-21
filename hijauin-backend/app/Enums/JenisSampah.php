<?php

namespace App\Enums;

/**
 * Canonical waste material types.
 * Extend via migration + adding a case here — never by loosening to free-text.
 *
 * @see docs/SCHEMA.md §kategori_sampah
 */
enum JenisSampah: string
{
    case Plastik = 'plastik';
    case Kertas = 'kertas';
    case Logam = 'logam';
    case Kaca = 'kaca';
}
