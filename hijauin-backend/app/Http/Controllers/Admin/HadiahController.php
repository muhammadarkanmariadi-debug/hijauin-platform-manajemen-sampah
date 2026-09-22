<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHadiahRequest;
use App\Http\Requests\Admin\UpdateHadiahRequest;
use App\Models\Hadiah;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class HadiahController extends Controller
{
    private const CACHE_TTL = 3600; // 1 hour

    /**
     * Touch / increment the version counter to invalidate list caches for a unit.
     */
    private function touchCache(int|string $unitId): void
    {
        $versionKey = "hadiah:v:{$unitId}";
        if (!Cache::has($versionKey)) {
            Cache::put($versionKey, 1, 86400 * 30);
        } else {
            Cache::increment($versionKey);
        }
    }

    public function index(Request $request): JsonResponse
    {
        $unitId = $request->unit_id;
        $version = Cache::get("hadiah:v:{$unitId}", 1);
        $cacheKey = "hadiah:list:u{$unitId}:v{$version}:" . md5(json_encode($request->all()));

        $cachedResponse = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($request, $unitId) {
            $pageSize = min((int) $request->input('pageSize', 15), 50);
            $search = $request->input('search');
            $stockStatus = $request->input('stock_status');
            $sortBy = $request->input('sort_by', 'poin_diperlukan');
            $sortDir = strtolower($request->input('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';

            $query = Hadiah::where('unit_id', $unitId);

            if ($stockStatus === 'tersedia') {
                $query->where('stok', '>', 0);
            } elseif ($stockStatus === 'habis') {
                $query->where('stok', '=', 0);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('deskripsi', 'like', "%{$search}%");
                });
            }

            if (in_array($sortBy, ['poin_diperlukan', 'stok', 'nama', 'created_at', 'id'])) {
                $query->orderBy($sortBy, $sortDir);
            } else {
                $query->orderBy('poin_diperlukan', 'asc');
            }

            $hadiahs = $query->paginate($pageSize);

            return [
                'data' => $hadiahs->getCollection()->toArray(),
                'meta' => [
                    'page' => $hadiahs->currentPage(),
                    'pageSize' => $hadiahs->perPage(),
                    'total' => $hadiahs->total(),
                ],
            ];
        });

        return response()->json($cachedResponse);
    }

    public function show(Request $request, Hadiah $hadiah): JsonResponse
    {
        if ($hadiah->unit_id !== $request->unit_id) {
            return $this->errorResponse('Not found.', 404);
        }

        $cacheKey = "hadiah:item_{$hadiah->id}";
        $data = Cache::remember($cacheKey, self::CACHE_TTL, fn() => $hadiah);

        return $this->successResponse($data);
    }

    public function store(StoreHadiahRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $hadiah = Hadiah::create([
            ...$validated,
            'unit_id' => $request->unit_id,
        ]);

        // Revalidate cache by touching unit version
        $this->touchCache($request->unit_id);

        return $this->createdResponse($hadiah);
    }

    public function bulkStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.nama' => ['required', 'string', 'max:150'],
            'items.*.poin_diperlukan' => ['required', 'integer', 'min:1'],
            'items.*.stok' => ['required', 'integer', 'min:0'],
            'items.*.deskripsi' => ['nullable', 'string'],
            'items.*.foto_url' => ['nullable', 'string'],
        ]);

        $created = [];
        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $request, &$created) {
            foreach ($validated['items'] as $itemData) {
                $created[] = Hadiah::create([
                    ...$itemData,
                    'unit_id' => $request->unit_id,
                ]);
            }
        });

        $this->touchCache($request->unit_id);

        return $this->createdResponse($created);
    }

    public function update(UpdateHadiahRequest $request, Hadiah $hadiah): JsonResponse
    {
        if ($hadiah->unit_id !== $request->unit_id) {
            return $this->errorResponse('Not found.', 404);
        }

        $validated = $request->validated();

        $hadiah->update($validated);

        // Invalidate single item cache & touch version for list cache revalidation
        Cache::touch("hadiah:item_{$hadiah->id}", 0);
        $this->touchCache($hadiah->unit_id);

        return $this->successResponse($hadiah);
    }

    public function destroy(Request $request, Hadiah $hadiah): JsonResponse
    {
        if ($hadiah->unit_id !== $request->unit_id) {
            return $this->errorResponse('Not found.', 404);
        }

        $unitId = $hadiah->unit_id;
        $id = $hadiah->id;

        $hadiah->delete();

        // Invalidate single item cache & touch version for list cache revalidation
        Cache::touch("hadiah:item_{$id}", 0);
        $this->touchCache($unitId);

        return $this->noContentResponse();
    }
}
