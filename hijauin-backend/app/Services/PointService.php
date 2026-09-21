<?php

namespace App\Services;

use App\Models\NasabahProfile;
use App\Models\SetorSampah;
use App\Models\DetailSetor;

/**
 * Shared point balance helpers.
 */
class PointService
{
    /**
     * Recalculate a nasabah's point balance from completed submissions.
     * Useful for debugging or data repair — not called in normal flow.
     */
    public function recalculateBalance(NasabahProfile $nasabah): int
    {
        $earned = DetailSetor::whereHas('setorSampah', function ($query) use ($nasabah) {
            $query->where('nasabah_profile_id', $nasabah->id)
                ->where('status', 'selesai');
        })->sum('subtotal_poin');

        $redeemed = $nasabah->penukaranPoins()
            ->whereIn('status', ['diproses', 'selesai'])
            ->sum('poin_ditukar');

        $balance = $earned - $redeemed;

        $nasabah->update(['saldo_poin' => $balance]);

        return $balance;
    }

    /**
     * Get a nasabah's point summary (earned, redeemed, current balance).
     */
    public function getSummary(NasabahProfile $nasabah): array
    {
        $earned = DetailSetor::whereHas('setorSampah', function ($query) use ($nasabah) {
            $query->where('nasabah_profile_id', $nasabah->id)
                ->where('status', 'selesai');
        })->sum('subtotal_poin');

        $redeemed = $nasabah->penukaranPoins()
            ->whereIn('status', ['diproses', 'selesai'])
            ->sum('poin_ditukar');

        return [
            'total_earned' => (int) $earned,
            'total_redeemed' => (int) $redeemed,
            'current_balance' => $nasabah->saldo_poin,
        ];
    }
}
