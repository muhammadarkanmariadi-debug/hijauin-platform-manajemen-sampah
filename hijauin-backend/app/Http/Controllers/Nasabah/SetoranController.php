<?php

namespace App\Http\Controllers\Nasabah;

use App\Http\Controllers\Controller;
use App\Http\Requests\Nasabah\StoreSetoranRequest;
use App\Models\SetorSampah;
use App\Models\DetailSetor;
use App\Models\KategoriSampah;
use App\Enums\StatusSetoran;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SetoranController extends Controller
{
    /**
     * List nasabah's submissions (paginated with status filter, search, and sort).
     */
    public function index(Request $request): JsonResponse
    {
        $nasabahProfile = $request->user()->nasabahProfile;
        $pageSize = min((int) $request->input('pageSize', 15), 50);
        $status = $request->input('status');
        $search = $request->input('search');
        $sortBy = $request->input('sort_by', 'tanggal');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $query = SetorSampah::where('nasabah_profile_id', $nasabahProfile->id)
            ->with('details.kategoriSampah');

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('catatan', 'like', "%{$search}%")
                  ->orWhereHas('details.kategoriSampah', function ($kq) use ($search) {
                      $kq->where('nama', 'like', "%{$search}%");
                  });
            });
        }

        if (in_array($sortBy, ['tanggal', 'created_at', 'status', 'id'])) {
            $query->orderBy($sortBy, $sortDir);
        } else {
            $query->orderByDesc('tanggal');
        }

        $setorans = $query->paginate($pageSize);

        return $this->paginatedResponse($setorans);
    }

    /**
     * Submit a new waste drop-off request.
     * subtotal_poin is NOT computed here — AGENT.md rule #3.
     */
    public function store(StoreSetoranRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $nasabahProfile = $request->user()->nasabahProfile;

        $setoran = SetorSampah::create([
            'nasabah_profile_id' => $nasabahProfile->id,
            'tanggal' => $validated['tanggal'],
            'status' => StatusSetoran::MenungguKonfirmasi,
            'catatan' => $validated['catatan'] ?? null,
        ]);

        foreach ($validated['items'] as $item) {
            DetailSetor::create([
                'setor_sampah_id' => $setoran->id,
                'kategori_sampah_id' => $item['kategori_sampah_id'],
                'berat_kg_estimasi' => $item['berat_kg_estimasi'],
                // berat_kg_real and subtotal_poin are null until verification
            ]);
        }

        return $this->createdResponse(
            $setoran->load('details.kategoriSampah')
        );
    }

    /**
     * Show a single submission.
     */
    public function show(Request $request, SetorSampah $setoran): JsonResponse
    {
        $nasabahProfile = $request->user()->nasabahProfile;

        // Ensure nasabah can only see their own submissions
        if ($setoran->nasabah_profile_id !== $nasabahProfile->id) {
            return $this->errorResponse('Not found.', 404);
        }

        return $this->successResponse(
            $setoran->load(['details.kategoriSampah', 'verifiedBy'])
        );
    }

    /**
     * Get active waste categories for the nasabah's unit.
     */
    public function kategoris(Request $request): JsonResponse
    {
        $nasabahProfile = $request->user()->nasabahProfile;
        $unitId = $nasabahProfile?->unit_id ?? $request->user()->userRoles()->value('unit_id') ?? 1;

        $version = \Illuminate\Support\Facades\Cache::get("kategori:v:{$unitId}", 1);
        $cacheKey = "kategori:active_list:u{$unitId}:v{$version}";

        $kategoris = \Illuminate\Support\Facades\Cache::remember($cacheKey, 3600, function () use ($unitId) {
            $list = KategoriSampah::where('unit_id', $unitId)->get();

            // If unit has no custom categories, fallback to first unit's categories
            if ($list->isEmpty()) {
                $list = KategoriSampah::where('unit_id', 1)->get();
            }

            return $list->toArray();
        });

        return $this->successResponse($kategoris);
    }
}
