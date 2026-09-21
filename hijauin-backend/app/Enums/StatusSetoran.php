<?php

namespace App\Enums;

/**
 * Canonical status enum for setor_sampah.
 * Defined once here — API docs, frontend, and tests must use these exact values.
 *
 * @see docs/SCHEMA.md §setor_sampah
 */
enum StatusSetoran: string
{
    case MenungguKonfirmasi = 'menunggu_konfirmasi';
    case Diverifikasi = 'diverifikasi';
    case Selesai = 'selesai';
    case Ditolak = 'ditolak';

    /**
     * Statuses that indicate an active/open submission.
     */
    public static function active(): array
    {
        return [self::MenungguKonfirmasi, self::Diverifikasi];
    }

    /**
     * Statuses that indicate a terminal state.
     */
    public static function terminal(): array
    {
        return [self::Selesai, self::Ditolak];
    }
}
