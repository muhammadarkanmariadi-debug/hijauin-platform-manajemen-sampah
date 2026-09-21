<?php

namespace App\Http\Controllers\Nasabah;

use App\Http\Controllers\Controller;
use App\Http\Requests\Nasabah\StorePenukaranRequest;
use App\Models\PenukaranPoin;
use App\Models\Hadiah;
use App\Services\PenukaranService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PenukaranController extends Controller
{
    public function __construct(
        private PenukaranService $penukaranService,
    ) {}

    /**
     * List nasabah's redemptions (paginated with status filter, search, and sort).
     */
    public function index(Request $request): JsonResponse
    {
        $nasabahProfile = $request->user()->nasabahProfile;
        $pageSize = min((int) $request->input('pageSize', 15), 50);
        $status = $request->input('status');
        $search = $request->input('search');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $query = PenukaranPoin::where('nasabah_profile_id', $nasabahProfile->id)
            ->with('hadiah');

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->whereHas('hadiah', function ($hq) use ($search) {
                $hq->where('nama', 'like', "%{$search}%")
                   ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        if (in_array($sortBy, ['created_at', 'poin_ditukar', 'status', 'id'])) {
            $query->orderBy($sortBy, $sortDir);
        } else {
            $query->orderByDesc('created_at');
        }

        $penukarans = $query->paginate($pageSize);

        return $this->paginatedResponse($penukarans);
    }

    /**
     * Redeem points for a reward.
     * Requires Idempotency-Key header (TRD §3, AGENT.md rule #5).
     */
    public function store(StorePenukaranRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $idempotencyKey = $request->header('Idempotency-Key');
        if (!$idempotencyKey) {
            return $this->errorResponse(
                'Idempotency-Key header is required for point-mutating operations.',
                422
            );
        }

        // Check for replay
        $existing = PenukaranPoin::where('idempotency_key', $idempotencyKey)->first();
        if ($existing) {
            return $this->successResponse($existing->load('hadiah'));
        }

        $nasabahProfile = $request->user()->nasabahProfile;

        $result = $this->penukaranService->redeem(
            $nasabahProfile,
            $validated['hadiah_id'],
            $idempotencyKey,
        );

        if ($result['error'] ?? false) {
            return $this->errorResponse($result['error'], $result['code']);
        }

        // Revalidate reward cache because stock has changed
        $unitId = $nasabahProfile->unit_id ?? 1;
        \Illuminate\Support\Facades\Cache::forget("hadiah:item_{$validated['hadiah_id']}");
        if (\Illuminate\Support\Facades\Cache::has("hadiah:v:{$unitId}")) {
            \Illuminate\Support\Facades\Cache::increment("hadiah:v:{$unitId}");
        } else {
            \Illuminate\Support\Facades\Cache::put("hadiah:v:{$unitId}", 2, 86400 * 30);
        }

        return $this->createdResponse($result['penukaran']->load('hadiah'));
    }

    /**
     * Show a single redemption.
     */
    public function show(Request $request, PenukaranPoin $penukaran): JsonResponse
    {
        $nasabahProfile = $request->user()->nasabahProfile;

        if ($penukaran->nasabah_profile_id !== $nasabahProfile->id) {
            return $this->errorResponse('Not found.', 404);
        }

        return $this->successResponse($penukaran->load('hadiah'));
    }

    /**
     * Get available rewards for the nasabah's unit.
     */
    public function hadiahs(Request $request): JsonResponse
    {
        $nasabahProfile = $request->user()->nasabahProfile;
        $unitId = $nasabahProfile?->unit_id ?? $request->user()->userRoles()->value('unit_id') ?? 1;

        $version = \Illuminate\Support\Facades\Cache::get("hadiah:v:{$unitId}", 1);
        $cacheKey = "hadiah:active_list:u{$unitId}:v{$version}";

        $hadiahs = \Illuminate\Support\Facades\Cache::remember($cacheKey, 3600, function () use ($unitId) {
            $list = Hadiah::where('unit_id', $unitId)
                ->where('stok', '>', 0)
                ->orderBy('poin_diperlukan', 'asc')
                ->get();

            // Fallback to unit 1 if unit has none
            if ($list->isEmpty()) {
                $list = Hadiah::where('unit_id', 1)
                    ->where('stok', '>', 0)
                    ->orderBy('poin_diperlukan', 'asc')
                    ->get();
            }

            return $list;
        });

        return $this->successResponse($hadiahs);
    }
}
