<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreOpsUserRequest;
use App\Http\Requests\Admin\UpdateOpsUserRequest;
use App\Http\Requests\Admin\StoreUnitRequest;
use App\Models\User;
use App\Models\Role;
use App\Models\UserRole;
use App\Models\BankSampahUnit;
use App\Models\NasabahProfile;
use App\Models\SetorSampah;
use App\Models\DetailSetor;
use App\Enums\RoleCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

/**
 * Platform Operations Superuser Controller.
 *
 * Provides platform-wide management APIs for platform_ops role:
 * - Cross-unit global overview metrics
 * - User & staff account management
 * - RBAC roles & permissions overview
 * - Multi-branch bank sampah unit directory
 */
class OpsController extends Controller
{
    private const CACHE_TTL = 600; // 10 minutes

    /**
     * Touch ops dashboard version to revalidate cache.
     */
    private function touchDashboard(): void
    {
        $key = 'ops:v:dashboard';
        if (!Cache::has($key)) {
            Cache::put($key, 1, 86400 * 30);
        } else {
            Cache::increment($key);
        }
    }

    /**
     * Touch ops units version to revalidate cache.
     */
    private function touchUnits(): void
    {
        $key = 'ops:v:units';
        if (!Cache::has($key)) {
            Cache::put($key, 1, 86400 * 30);
        } else {
            Cache::increment($key);
        }
    }

    /**
     * Platform-wide global metrics for ops dashboard.
     */
    public function dashboard(): JsonResponse
    {
        $version = Cache::get('ops:v:dashboard', 1);
        $cacheKey = "ops:dashboard:v{$version}";

        $data = Cache::remember($cacheKey, self::CACHE_TTL, function () {
            $totalUnits = BankSampahUnit::count();
            $totalNasabahs = NasabahProfile::count();
            $totalUsers = User::count();
            $totalSetorans = SetorSampah::count();
            $pendingSetorans = SetorSampah::where('status', 'menunggu_konfirmasi')->count();

            $totalKg = DetailSetor::whereNotNull('berat_kg_real')->sum('berat_kg_real');
            if ($totalKg == 0) {
                $totalKg = DetailSetor::sum('berat_kg_estimasi');
            }

            $totalPoin = DetailSetor::sum('subtotal_poin') ?? 0;

            $units = BankSampahUnit::withCount('nasabahProfiles')
                ->orderBy('id')
                ->get();

            return [
                'total_units' => $totalUnits,
                'total_nasabahs' => $totalNasabahs,
                'total_users' => $totalUsers,
                'total_setorans' => $totalSetorans,
                'pending_setorans' => $pendingSetorans,
                'total_kg' => round((float) $totalKg, 1),
                'total_poin' => (int) $totalPoin,
                'units' => $units,
            ];
        });

        return $this->successResponse($data);
    }

    /**
     * List all platform users with role and unit relations (with search, filter, and sort).
     */
    public function users(Request $request): JsonResponse
    {
        $pageSize = min((int) $request->input('pageSize', 15), 50);
        $search = $request->input('search');
        $roleFilter = $request->input('role');
        $unitFilter = $request->input('unit_id');
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $query = User::with(['userRoles.role', 'userRoles.unit', 'nasabahProfile.unit']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($roleFilter) {
            $query->whereHas('userRoles.role', function ($q) use ($roleFilter) {
                $q->where('code', $roleFilter);
            });
        }

        if ($unitFilter) {
            $query->where(function ($q) use ($unitFilter) {
                $q->whereHas('userRoles', function ($uq) use ($unitFilter) {
                    $uq->where('unit_id', $unitFilter);
                })->orWhereHas('nasabahProfile', function ($nq) use ($unitFilter) {
                    $nq->where('unit_id', $unitFilter);
                });
            });
        }

        if (in_array($sortBy, ['full_name', 'email', 'created_at', 'id'])) {
            $query->orderBy($sortBy, $sortDir);
        } else {
            $query->orderBy('id', 'desc');
        }

        $paginator = $query->paginate($pageSize);

        return $this->paginatedResponse($paginator);
    }

    /**
     * Create a new platform user with specified role and unit scope.
     */
    public function storeUser(StoreOpsUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {
            $newUser = User::create([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
            ]);

            $role = Role::where('code', $validated['role_code'])->firstOrFail();

            UserRole::create([
                'user_id' => $newUser->id,
                'role_id' => $role->id,
                'unit_id' => $validated['unit_id'] ?? null,
            ]);

            if ($validated['role_code'] === RoleCode::Nasabah->value && !empty($validated['unit_id'])) {
                NasabahProfile::create([
                    'user_id' => $newUser->id,
                    'unit_id' => $validated['unit_id'],
                    'saldo_poin' => 0,
                ]);
            }

            return $newUser->load(['userRoles.role', 'userRoles.unit', 'nasabahProfile.unit']);
        });

        // Revalidate ops dashboard metrics
        $this->touchDashboard();

        return $this->createdResponse($user);
    }

    /**
     * Update user details, assigned role, or unit.
     */
    public function updateUser(UpdateOpsUserRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($user, $validated) {
            $user->update([
                'full_name' => $validated['full_name'] ?? $user->full_name,
                'phone' => array_key_exists('phone', $validated) ? $validated['phone'] : $user->phone,
            ]);

            if (!empty($validated['role_code'])) {
                $role = Role::where('code', $validated['role_code'])->firstOrFail();

                UserRole::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'role_id' => $role->id,
                        'unit_id' => $validated['unit_id'] ?? null,
                    ]
                );

                if ($validated['role_code'] === RoleCode::Nasabah->value && !empty($validated['unit_id'])) {
                    NasabahProfile::firstOrCreate(
                        ['user_id' => $user->id],
                        ['unit_id' => $validated['unit_id'], 'saldo_poin' => 0]
                    );
                }
            }
        });

        // Revalidate ops dashboard metrics
        $this->touchDashboard();

        return $this->successResponse($user->load(['userRoles.role', 'userRoles.unit', 'nasabahProfile.unit']));
    }

    /**
     * Delete user account.
     */
    public function deleteUser(User $user): JsonResponse
    {
        $user->delete();

        // Revalidate ops dashboard metrics
        $this->touchDashboard();

        return $this->noContentResponse();
    }

    /**
     * List all system RBAC roles and permissions.
     */
    public function roles(): JsonResponse
    {
        $cacheKey = 'ops:roles:all';
        $roles = Cache::remember($cacheKey, 86400, function () {
            return Role::with('permissions')
                ->withCount('userRoles')
                ->get();
        });

        return $this->successResponse($roles);
    }

    /**
     * List bank sampah branch units with summary stats (supports search, sort, and pagination).
     */
    public function units(Request $request): JsonResponse
    {
        $version = Cache::get('ops:v:units', 1);
        $cacheKey = "ops:units:v{$version}:" . md5(json_encode($request->all()));

        $cachedData = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($request) {
            $search = $request->input('search');
            $sortBy = $request->input('sort_by', 'id');
            $sortDir = strtolower($request->input('sort_dir', 'asc')) === 'desc' ? 'desc' : 'asc';

            $query = BankSampahUnit::withCount(['nasabahProfiles', 'kategoris']);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                      ->orWhere('alamat', 'like', "%{$search}%")
                      ->orWhere('telepon', 'like', "%{$search}%");
                });
            }

            if ($sortBy === 'nasabah_profiles_count') {
                $query->orderBy('nasabah_profiles_count', $sortDir);
            } elseif (in_array($sortBy, ['nama', 'created_at', 'id'])) {
                $query->orderBy($sortBy, $sortDir);
            } else {
                $query->orderBy('id', 'asc');
            }

            if ($request->has('paginate') || $request->has('page')) {
                $pageSize = min((int) $request->input('pageSize', 12), 50);
                $paginator = $query->paginate($pageSize);
                return [
                    'is_paginated' => true,
                    'data' => $paginator->items(),
                    'meta' => [
                        'page' => $paginator->currentPage(),
                        'pageSize' => $paginator->perPage(),
                        'total' => $paginator->total(),
                    ],
                ];
            }

            return [
                'is_paginated' => false,
                'data' => $query->get(),
            ];
        });

        if ($cachedData['is_paginated']) {
            return response()->json([
                'data' => $cachedData['data'],
                'meta' => $cachedData['meta'],
            ]);
        }

        return $this->successResponse($cachedData['data']);
    }

    /**
     * Register a new bank sampah unit branch.
     */
    public function storeUnit(StoreUnitRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $unit = BankSampahUnit::create($validated);

        // Revalidate ops dashboard and units caches
        $this->touchDashboard();
        $this->touchUnits();

        return $this->createdResponse($unit);
    }
}
