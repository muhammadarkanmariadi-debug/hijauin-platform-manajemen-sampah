<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\VerifySetoranRequest;
use App\Models\SetorSampah;
use App\Models\NasabahProfile;
use App\Services\SetoranService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerifikasiController extends Controller
{
    public function __construct(
        private SetoranService $setoranService,
    ) {}

    /**
     * List submissions for the admin's unit (paginated with search, status filter, and sort).
     */
    public function index(Request $request): JsonResponse
    {
        $pageSize = min((int) $request->input('pageSize', 15), 50);
        $search = $request->input('search');
        $status = $request->input('status');
        $sortBy = $request->input('sort_by', 'tanggal');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $nasabahIds = NasabahProfile::where('unit_id', $request->unit_id)
            ->pluck('id');

        $query = SetorSampah::whereIn('nasabah_profile_id', $nasabahIds)
            ->with(['nasabahProfile.user', 'details.kategoriSampah', 'verifiedBy']);

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('catatan', 'like', "%{$search}%")
                  ->orWhereHas('nasabahProfile.user', function ($uq) use ($search) {
                      $uq->where('full_name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
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
     * Show a single submission.
     */
    public function show(Request $request, SetorSampah $setoran): JsonResponse
    {
        if ($setoran->nasabahProfile->unit_id !== $request->unit_id) {
            return $this->errorResponse('Not found.', 404);
        }

        return $this->successResponse(
            $setoran->load(['nasabahProfile.user', 'details.kategoriSampah', 'verifiedBy'])
        );
    }

    /**
     * Verify a submission — supports per-item outcomes (TRD §4).
     * Point calculation happens HERE, not at submission (AGENT.md rule #3).
     */
    public function verify(VerifySetoranRequest $request, SetorSampah $setoran): JsonResponse
    {
        if ($setoran->nasabahProfile->unit_id !== $request->unit_id) {
            return $this->errorResponse('Not found.', 404);
        }

        $validated = $request->validated();

        $result = $this->setoranService->verify(
            $setoran,
            $validated['items'],
            $request->user(),
        );

        if ($result['error'] ?? false) {
            return $this->errorResponse($result['error'], $result['code']);
        }

        // Revalidate rekap & ops cached metrics on verified waste transactions
        $unitId = $setoran->nasabahProfile->unit_id;
        if (\Illuminate\Support\Facades\Cache::has("rekap:v:{$unitId}")) {
            \Illuminate\Support\Facades\Cache::increment("rekap:v:{$unitId}");
        } else {
            \Illuminate\Support\Facades\Cache::put("rekap:v:{$unitId}", 2, 86400 * 30);
        }

        if (\Illuminate\Support\Facades\Cache::has("rekap:v:all")) {
            \Illuminate\Support\Facades\Cache::increment("rekap:v:all");
        } else {
            \Illuminate\Support\Facades\Cache::put("rekap:v:all", 2, 86400 * 30);
        }

        if (\Illuminate\Support\Facades\Cache::has("ops:v:dashboard")) {
            \Illuminate\Support\Facades\Cache::increment("ops:v:dashboard");
        } else {
            \Illuminate\Support\Facades\Cache::put("ops:v:dashboard", 2, 86400 * 30);
        }

        return $this->successResponse(
            $result['setoran']->load(['details.kategoriSampah', 'verifiedBy'])
        );
    }
}
