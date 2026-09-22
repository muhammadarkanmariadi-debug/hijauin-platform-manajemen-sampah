<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreKategoriRequest;
use App\Http\Requests\Admin\UpdateKategoriRequest;
use App\Models\KategoriSampah;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class KategoriController extends Controller
{
    private const CACHE_TTL = 3600; // 1 hour

    /**
     * Touch / increment the version counter to invalidate list caches for a unit.
     */
    private function touchCache(int|string $unitId): void
    {
        $versionKey = "kategori:v:{$unitId}";
        if (!Cache::has($versionKey)) {
            Cache::put($versionKey, 1, 86400 * 30);
        } else {
            Cache::increment($versionKey);
        }
    }

    public function index(Request $request): JsonResponse
    {
        $unitId = $request->unit_id;
        $version = Cache::get("kategori:v:{$unitId}", 1);
        $cacheKey = "kategori:list:u{$unitId}:v{$version}:" . md5(json_encode($request->all()));

        $cachedResponse = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($request, $unitId) {
            $pageSize = min((int) $request->input('pageSize', 15), 50);
            $search = $request->input('search');
            $jenis = $request->input('jenis');
            $sortBy = $request->input('sort_by', 'nama');
            $sortDir = strtolower($request->input('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';

            $query = KategoriSampah::where('unit_id', $unitId);

            if ($jenis && $jenis !== 'all') {
                $query->where('jenis', $jenis);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('deskripsi', 'like', "%{$search}%");
                });
            }

            if (in_array($sortBy, ['nama', 'harga_per_kg', 'poin_per_kg', 'created_at', 'id'])) {
                $query->orderBy($sortBy, $sortDir);
            } else {
                $query->orderBy('nama', 'asc');
            }

            $kategoris = $query->paginate($pageSize);

            return [
                'data' => $kategoris->getCollection()->toArray(),
                'meta' => [
                    'page' => $kategoris->currentPage(),
                    'pageSize' => $kategoris->perPage(),
                    'total' => $kategoris->total(),
                ],
            ];
        });

        return response()->json($cachedResponse);
    }

    public function show(Request $request, KategoriSampah $kategori): JsonResponse
    {
        if ($kategori->unit_id !== $request->unit_id) {
            return $this->errorResponse('Not found.', 404);
        }

        $cacheKey = "kategori:item_{$kategori->id}";
        $data = Cache::remember($cacheKey, self::CACHE_TTL, fn() => $kategori);

        return $this->successResponse($data);
    }

    public function store(StoreKategoriRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $kategori = KategoriSampah::create([
            ...$validated,
            'unit_id' => $request->unit_id,
        ]);

        // Revalidate cache by touching unit version
        $this->touchCache($request->unit_id);

        return $this->createdResponse($kategori);
    }

    public function bulkStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.nama' => ['required', 'string', 'max:100'],
            'items.*.jenis' => ['required', 'string', 'in:plastik,kertas,logam,kaca'],
            'items.*.harga_per_kg' => ['required', 'numeric', 'min:0'],
            'items.*.poin_per_kg' => ['required', 'integer', 'min:0'],
            'items.*.deskripsi' => ['nullable', 'string'],
            'items.*.foto_url' => ['nullable', 'string'],
        ]);

        $created = [];
        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $request, &$created) {
            foreach ($validated['items'] as $itemData) {
                $created[] = KategoriSampah::create([
                    ...$itemData,
                    'unit_id' => $request->unit_id,
                ]);
            }
        });

        $this->touchCache($request->unit_id);

        return $this->createdResponse($created);
    }

    public function update(UpdateKategoriRequest $request, KategoriSampah $kategori): JsonResponse
    {
        if ($kategori->unit_id !== $request->unit_id) {
            return $this->errorResponse('Not found.', 404);
        }

        $validated = $request->validated();

        $kategori->update($validated);

        // Invalidate single item cache & touch version for list cache revalidation
        Cache::touch("kategori:item_{$kategori->id}", 0);
        $this->touchCache($kategori->unit_id);

        return $this->successResponse($kategori);
    }

    public function destroy(Request $request, KategoriSampah $kategori): JsonResponse
    {
        if ($kategori->unit_id !== $request->unit_id) {
            return $this->errorResponse('Not found.', 404);
        }

        $unitId = $kategori->unit_id;
        $id = $kategori->id;

        $kategori->delete();

        // Invalidate single item cache & touch version for list cache revalidation
        Cache::touch("kategori:item_{$id}", 0);
        $this->touchCache($unitId);

        return $this->noContentResponse();
    }
}
