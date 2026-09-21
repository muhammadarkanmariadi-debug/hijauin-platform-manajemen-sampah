<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RekapQueryRequest;
use App\Models\NasabahProfile;
use App\Models\SetorSampah;
use App\Models\DetailSetor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class RekapController extends Controller
{
    private const CACHE_TTL = 1800; // 30 minutes

    /**
     * Monthly recap: total tonnage and estimated payout, broken down by material type.
     * Filterable by month/year (defaults to current month) and optional unit scoping.
     * Includes 6-month rolling trend and MoM growth metrics.
     */
    public function index(RekapQueryRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $month = (int) ($validated['month'] ?? now()->month);
        $year = (int) ($validated['year'] ?? now()->year);

        $isAllUnits = $request->boolean('all_units') && $request->get('is_platform_ops');
        $scopedUnitId = $isAllUnits ? null : ($validated['unit_id'] ?? $request->unit_id);
        $unitKey = $isAllUnits ? 'all' : ($scopedUnitId ?? 'default');

        $version = Cache::get("rekap:v:{$unitKey}", 1);
        $cacheKey = "rekap:u{$unitKey}:v{$version}:m{$month}:y{$year}";

        $data = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($month, $year, $scopedUnitId, $isAllUnits) {
            $nasabahQuery = NasabahProfile::query();

            // If not all_units (or not superops requesting all), scope to request->unit_id
            if (!$isAllUnits && $scopedUnitId) {
                $nasabahQuery->where('unit_id', $scopedUnitId);
            }

            $nasabahIds = $nasabahQuery->pluck('id');

            // Current period setorans
            $setoranIds = SetorSampah::whereIn('nasabah_profile_id', $nasabahIds)
                ->whereMonth('tanggal', $month)
                ->whereYear('tanggal', $year)
                ->whereIn('status', ['selesai', 'diverifikasi'])
                ->pluck('id');

            $breakdown = DetailSetor::whereIn('setor_sampah_id', $setoranIds)
                ->join('kategori_sampah', 'detail_setor.kategori_sampah_id', '=', 'kategori_sampah.id')
                ->select(
                    'kategori_sampah.jenis',
                    DB::raw('ROUND(SUM(COALESCE(detail_setor.berat_kg_real, detail_setor.berat_kg_estimasi, 0)), 2) as total_kg'),
                    DB::raw('SUM(COALESCE(detail_setor.subtotal_poin, 0)) as total_poin'),
                    DB::raw('COUNT(*) as jumlah_item')
                )
                ->groupBy('kategori_sampah.jenis')
                ->get()
                ->map(function ($row) {
                    return [
                        'jenis' => $row->jenis,
                        'total_kg' => (float) $row->total_kg,
                        'total_poin' => (int) $row->total_poin,
                        'jumlah_item' => (int) $row->jumlah_item,
                    ];
                });

            $totalKg = round((float) $breakdown->sum('total_kg'), 2);
            $totalPoin = (int) $breakdown->sum('total_poin');
            $jumlahSetoran = $setoranIds->count();
            $avgKgPerSetoran = $jumlahSetoran > 0 ? round($totalKg / $jumlahSetoran, 2) : 0;

            $totals = [
                'total_kg' => $totalKg,
                'total_poin' => $totalPoin,
                'jumlah_setoran' => $jumlahSetoran,
                'avg_kg_per_setoran' => $avgKgPerSetoran,
            ];

            // Previous month for MoM growth comparison
            $currentDate = \Carbon\Carbon::createFromDate($year, $month, 1);
            $prevDate = (clone $currentDate)->subMonth();

            $prevSetoranIds = SetorSampah::whereIn('nasabah_profile_id', $nasabahIds)
                ->whereMonth('tanggal', $prevDate->month)
                ->whereYear('tanggal', $prevDate->year)
                ->whereIn('status', ['selesai', 'diverifikasi'])
                ->pluck('id');

            $prevBreakdown = DetailSetor::whereIn('setor_sampah_id', $prevSetoranIds)
                ->select(
                    DB::raw('ROUND(SUM(COALESCE(berat_kg_real, berat_kg_estimasi, 0)), 2) as total_kg'),
                    DB::raw('SUM(COALESCE(subtotal_poin, 0)) as total_poin')
                )
                ->first();

            $prevKg = (float) ($prevBreakdown?->total_kg ?? 0);
            $prevPoin = (int) ($prevBreakdown?->total_poin ?? 0);

            $kgGrowth = $prevKg > 0 ? round((($totalKg - $prevKg) / $prevKg) * 100, 1) : null;
            $poinGrowth = $prevPoin > 0 ? round((($totalPoin - $prevPoin) / $prevPoin) * 100, 1) : null;

            // 6-Month Rolling Trend
            $trend = [];
            for ($i = 5; $i >= 0; $i--) {
                $trendDate = (clone $currentDate)->subMonths($i);
                $tMonth = $trendDate->month;
                $tYear = $trendDate->year;

                $monthSetorans = SetorSampah::whereIn('nasabah_profile_id', $nasabahIds)
                    ->whereMonth('tanggal', $tMonth)
                    ->whereYear('tanggal', $tYear)
                    ->whereIn('status', ['selesai', 'diverifikasi'])
                    ->pluck('id');

                $monthDetails = DetailSetor::whereIn('setor_sampah_id', $monthSetorans)
                    ->join('kategori_sampah', 'detail_setor.kategori_sampah_id', '=', 'kategori_sampah.id')
                    ->select(
                        'kategori_sampah.jenis',
                        DB::raw('ROUND(SUM(COALESCE(detail_setor.berat_kg_real, detail_setor.berat_kg_estimasi, 0)), 2) as total_kg'),
                        DB::raw('SUM(COALESCE(detail_setor.subtotal_poin, 0)) as total_poin')
                    )
                    ->groupBy('kategori_sampah.jenis')
                    ->get();

                $byMaterial = [
                    'plastik' => 0.0,
                    'kertas' => 0.0,
                    'logam' => 0.0,
                    'kaca' => 0.0,
                ];

                $mKg = 0.0;
                $mPoin = 0;

                foreach ($monthDetails as $md) {
                    $kg = (float) $md->total_kg;
                    $p = (int) $md->total_poin;
                    if (isset($byMaterial[$md->jenis])) {
                        $byMaterial[$md->jenis] = $kg;
                    }
                    $mKg += $kg;
                    $mPoin += $p;
                }

                $monthNames = [
                    1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
                    5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Agu',
                    9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des',
                ];

                $trend[] = [
                    'month' => $tMonth,
                    'year' => $tYear,
                    'label' => $monthNames[$tMonth] . ' ' . substr((string) $tYear, 2),
                    'total_kg' => round($mKg, 2),
                    'total_poin' => $mPoin,
                    'jumlah_setoran' => $monthSetorans->count(),
                    'breakdown' => $byMaterial,
                ];
            }

            return [
                'period' => ['month' => $month, 'year' => $year],
                'totals' => $totals,
                'growth' => [
                    'kg_growth_percent' => $kgGrowth,
                    'poin_growth_percent' => $poinGrowth,
                    'prev_total_kg' => $prevKg,
                    'prev_total_poin' => $prevPoin,
                ],
                'breakdown' => $breakdown,
                'trend' => $trend,
            ];
        });

        return $this->successResponse($data);
    }
}
