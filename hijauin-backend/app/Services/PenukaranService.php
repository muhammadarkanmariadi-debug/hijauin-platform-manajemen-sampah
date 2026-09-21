<?php

namespace App\Services;

use App\Models\NasabahProfile;
use App\Models\Hadiah;
use App\Models\PenukaranPoin;
use App\Enums\StatusPenukaran;
use Illuminate\Support\Facades\DB;

/**
 * Handles point redemption with atomic balance check and stock decrement.
 *
 * @see TRD.md §3 (optimistic concurrency on stock)
 * @see TRD.md §4 (balance checked and decremented atomically)
 */
class PenukaranService
{
    /**
     * Redeem points for a reward item.
     * Uses SELECT ... FOR UPDATE on both nasabah balance and hadiah stock
     * to prevent overselling and double-spend.
     */
    public function redeem(NasabahProfile $nasabah, int $hadiahId, string $idempotencyKey): array
    {
        return DB::transaction(function () use ($nasabah, $hadiahId, $idempotencyKey) {
            // Lock the hadiah row to prevent overselling
            $hadiah = Hadiah::lockForUpdate()->findOrFail($hadiahId);

            // Verify hadiah belongs to the nasabah's unit
            if ($hadiah->unit_id !== $nasabah->unit_id) {
                return ['error' => 'Reward not found in your unit.', 'code' => 404];
            }

            // Check stock
            if ($hadiah->stok <= 0) {
                return ['error' => 'Reward is out of stock.', 'code' => 422];
            }

            // Lock and check nasabah balance
            $nasabah = NasabahProfile::lockForUpdate()->findOrFail($nasabah->id);

            if ($nasabah->saldo_poin < $hadiah->poin_diperlukan) {
                return ['error' => 'Insufficient point balance.', 'code' => 422];
            }

            // Atomic decrement
            $nasabah->decrement('saldo_poin', $hadiah->poin_diperlukan);
            $hadiah->decrement('stok');

            $penukaran = PenukaranPoin::create([
                'nasabah_profile_id' => $nasabah->id,
                'hadiah_id' => $hadiah->id,
                'poin_ditukar' => $hadiah->poin_diperlukan,
                'status' => StatusPenukaran::Diproses,
                'idempotency_key' => $idempotencyKey,
            ]);

            return ['penukaran' => $penukaran];
        });
    }
}
