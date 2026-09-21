<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\NasabahProfile;
use App\Models\KategoriSampah;
use App\Models\SetorSampah;
use App\Models\DetailSetor;
use App\Enums\RoleCode;
use App\Enums\StatusSetoran;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SetoranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('code', RoleCode::AdminUnit->value)->first();
        $admins = User::whereHas('userRoles', function ($q) use ($adminRole) {
            $q->where('role_id', $adminRole->id);
        })->get()->keyBy(function ($u) {
            return $u->userRoles->first()->unit_id;
        });

        $profiles = NasabahProfile::with('user')->get();
        if ($profiles->isEmpty()) return;

        // Clean existing to allow idempotent runs
        DetailSetor::truncate();
        SetorSampah::truncate();

        $submissionTemplates = [
            // Month -2 (approx 60 days ago)
            [
                'days_ago' => 58,
                'status' => StatusSetoran::Selesai,
                'catatan' => 'Setoran rutin bulanan warga RT 02.',
                'items' => [
                    ['jenis' => 'plastik', 'est' => 6.0, 'real' => 6.2],
                    ['jenis' => 'kertas', 'est' => 12.0, 'real' => 11.8],
                ],
            ],
            [
                'days_ago' => 50,
                'status' => StatusSetoran::Diverifikasi,
                'catatan' => 'Kardus packing pindahan dan botol minuman.',
                'items' => [
                    ['jenis' => 'kertas', 'est' => 15.0, 'real' => 15.4],
                    ['jenis' => 'logam', 'est' => 2.5, 'real' => 2.8],
                ],
            ],
            // Month -1 (approx 30 days ago)
            [
                'days_ago' => 38,
                'status' => StatusSetoran::Diverifikasi,
                'catatan' => 'Pembersihan gudang rumah.',
                'items' => [
                    ['jenis' => 'kaca', 'est' => 8.0, 'real' => 8.0],
                    ['jenis' => 'plastik', 'est' => 4.5, 'real' => 4.6],
                ],
            ],
            [
                'days_ago' => 28,
                'status' => StatusSetoran::Diverifikasi,
                'catatan' => 'Kaleng minuman kemasan rapat dan botol air mineral.',
                'items' => [
                    ['jenis' => 'logam', 'est' => 4.0, 'real' => 4.1],
                    ['jenis' => 'plastik', 'est' => 5.0, 'real' => 5.2],
                ],
            ],
            [
                'days_ago' => 21,
                'status' => StatusSetoran::Ditolak,
                'catatan' => 'Sampah tercampur limbah basah dan sisa makanan busuk.',
                'items' => [
                    ['jenis' => 'kertas', 'est' => 5.0, 'real' => null],
                ],
            ],
            // Current Month
            [
                'days_ago' => 12,
                'status' => StatusSetoran::Diverifikasi,
                'catatan' => 'Kertas arsip kantor bekas dan kardus makanan kering.',
                'items' => [
                    ['jenis' => 'kertas', 'est' => 10.0, 'real' => 10.5],
                    ['jenis' => 'plastik', 'est' => 3.0, 'real' => 3.2],
                ],
            ],
            [
                'days_ago' => 6,
                'status' => StatusSetoran::Diverifikasi,
                'catatan' => 'Botol kecap kaca dan botol sirup utuh.',
                'items' => [
                    ['jenis' => 'kaca', 'est' => 6.0, 'real' => 6.3],
                    ['jenis' => 'logam', 'est' => 1.5, 'real' => 1.6],
                ],
            ],
            [
                'days_ago' => 2,
                'status' => StatusSetoran::MenungguKonfirmasi,
                'catatan' => 'Menunggu dijemput atau diserahkan saat jam buka unit.',
                'items' => [
                    ['jenis' => 'plastik', 'est' => 4.0, 'real' => null],
                    ['jenis' => 'kertas', 'est' => 7.5, 'real' => null],
                ],
            ],
            [
                'days_ago' => 0,
                'status' => StatusSetoran::MenungguKonfirmasi,
                'catatan' => 'Setoran baru hari ini dari pemilahan akhir pekan.',
                'items' => [
                    ['jenis' => 'logam', 'est' => 3.5, 'real' => null],
                    ['jenis' => 'plastik', 'est' => 5.0, 'real' => null],
                ],
            ],
        ];

        // Seed across multiple profiles
        foreach ($profiles as $profile) {
            $unitId = $profile->unit_id;
            $adminUser = $admins->get($unitId) ?? $admins->first();
            $unitCategories = KategoriSampah::where('unit_id', $unitId)->get();

            // Pick 3 to 5 templates per nasabah
            $templatesForUser = array_slice($submissionTemplates, 0, rand(3, count($submissionTemplates)));

            foreach ($templatesForUser as $tpl) {
                $subDate = Carbon::now()->subDays($tpl['days_ago'])->toDateString();

                $setoran = SetorSampah::create([
                    'nasabah_profile_id' => $profile->id,
                    'tanggal' => $subDate,
                    'status' => $tpl['status'],
                    'catatan' => $tpl['catatan'],
                    'verified_by_user_id' => in_array($tpl['status'], [StatusSetoran::Diverifikasi, StatusSetoran::Selesai]) ? $adminUser?->id : null,
                    'verified_at' => in_array($tpl['status'], [StatusSetoran::Diverifikasi, StatusSetoran::Selesai]) ? Carbon::parse($subDate)->addHours(4) : null,
                ]);

                foreach ($tpl['items'] as $item) {
                    $cat = $unitCategories->firstWhere('jenis', $item['jenis']) ?? $unitCategories->first();
                    if (!$cat) continue;

                    $realKg = $item['real'];
                    $subtotalPoin = null;
                    if ($realKg !== null && in_array($tpl['status'], [StatusSetoran::Diverifikasi, StatusSetoran::Selesai])) {
                        $subtotalPoin = (int) round($realKg * $cat->poin_per_kg);
                    }

                    DetailSetor::create([
                        'setor_sampah_id' => $setoran->id,
                        'kategori_sampah_id' => $cat->id,
                        'berat_kg_estimasi' => $item['est'],
                        'berat_kg_real' => $realKg,
                        'subtotal_poin' => $subtotalPoin,
                    ]);
                }
            }
        }
    }
}
