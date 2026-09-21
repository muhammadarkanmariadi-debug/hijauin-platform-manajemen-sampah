<?php

namespace App\Services;

use App\Models\SetorSampah;
use App\Models\DetailSetor;
use App\Models\User;
use App\Enums\StatusSetoran;
use Illuminate\Support\Facades\DB;

/**
 * Business logic for waste submissions and verification.
 * Point calculation happens here at verification, NOT at submission (AGENT.md rule #3).
 */
class SetoranService
{
    /**
     * Verify a submission with per-item outcomes (TRD §4).
     *
     * @param SetorSampah $setoran
     * @param array $items  Each: { detail_setor_id, berat_kg_real, accepted }
     * @param User $verifier
     * @return array
     */
    public function verify(SetorSampah $setoran, array $items, User $verifier): array
    {
        if ($setoran->status !== StatusSetoran::MenungguKonfirmasi) {
            return [
                'error' => 'Submission is not in a verifiable state.',
                'code' => 422,
            ];
        }

        return DB::transaction(function () use ($setoran, $items, $verifier) {
            $totalPoin = 0;
            $allRejected = true;

            foreach ($items as $item) {
                $detail = DetailSetor::where('id', $item['detail_setor_id'])
                    ->where('setor_sampah_id', $setoran->id)
                    ->firstOrFail();

                if ($item['accepted']) {
                    $allRejected = false;

                    // Point calculation at verification — uses real weight × poin_per_kg
                    $poinPerKg = $detail->kategoriSampah->poin_per_kg;
                    $subtotal = (int) floor($item['berat_kg_real'] * $poinPerKg);

                    $detail->update([
                        'berat_kg_real' => $item['berat_kg_real'],
                        'subtotal_poin' => $subtotal,
                    ]);

                    $totalPoin += $subtotal;
                } else {
                    $detail->update([
                        'berat_kg_real' => 0,
                        'subtotal_poin' => 0,
                    ]);
                }
            }

            // Update submission status
            $status = $allRejected ? StatusSetoran::Ditolak : StatusSetoran::Selesai;

            $setoran->update([
                'status' => $status,
                'verified_by_user_id' => $verifier->id,
                'verified_at' => now(),
            ]);

            // Credit nasabah's point balance
            if ($totalPoin > 0) {
                $setoran->nasabahProfile->increment('saldo_poin', $totalPoin);
            }

            return ['setoran' => $setoran->fresh()];
        });
    }
}
