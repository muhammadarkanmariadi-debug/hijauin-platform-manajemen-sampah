<?php

namespace Database\Seeders;

use App\Models\NasabahProfile;
use App\Models\Hadiah;
use App\Models\PenukaranPoin;
use App\Enums\StatusPenukaran;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PenukaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PenukaranPoin::truncate();

        $profiles = NasabahProfile::all();

        foreach ($profiles as $profile) {
            $unitHadiahs = Hadiah::where('unit_id', $profile->unit_id)->get();
            if ($unitHadiahs->isEmpty()) continue;

            // Seed 1-2 redemptions per profile
            $h1 = $unitHadiahs->get(0);
            $h2 = $unitHadiahs->get(3) ?? $h1;

            if ($h1) {
                PenukaranPoin::create([
                    'nasabah_profile_id' => $profile->id,
                    'hadiah_id' => $h1->id,
                    'poin_ditukar' => $h1->poin_diperlukan,
                    'status' => StatusPenukaran::Selesai,
                    'idempotency_key' => (string) Str::uuid(),
                    'created_at' => now()->subDays(14),
                    'updated_at' => now()->subDays(13),
                ]);
            }

            if ($h2) {
                PenukaranPoin::create([
                    'nasabah_profile_id' => $profile->id,
                    'hadiah_id' => $h2->id,
                    'poin_ditukar' => $h2->poin_diperlukan,
                    'status' => StatusPenukaran::Diproses,
                    'idempotency_key' => (string) Str::uuid(),
                    'created_at' => now()->subDays(1),
                    'updated_at' => now()->subDays(1),
                ]);
            }
        }
    }
}
