<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreNasabahRequest;
use App\Http\Requests\Admin\UpdateNasabahRequest;
use App\Models\NasabahProfile;
use App\Models\User;
use App\Models\UserRole;
use App\Models\Role;
use App\Enums\RoleCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NasabahController extends Controller
{
    /**
     * List nasabahs for the admin's unit (paginated with search, filter, and sort).
     */
    public function index(Request $request): JsonResponse
    {
        $pageSize = min((int) $request->input('pageSize', 15), 50);
        $search = $request->input('search');
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDir = strtolower($request->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';
        $balanceFilter = $request->input('balance_filter'); // 'has_balance', 'zero_balance'

        $query = NasabahProfile::where('nasabah_profiles.unit_id', $request->unit_id)
            ->with('user');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('alamat', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('full_name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        if ($balanceFilter === 'has_balance') {
            $query->where('saldo_poin', '>', 0);
        } elseif ($balanceFilter === 'zero_balance') {
            $query->where('saldo_poin', '=', 0);
        }

        if ($sortBy === 'full_name' || $sortBy === 'name') {
            $query->join('users', 'nasabah_profiles.user_id', '=', 'users.id')
                  ->select('nasabah_profiles.*')
                  ->orderBy('users.full_name', $sortDir);
        } elseif (in_array($sortBy, ['saldo_poin', 'created_at', 'id'])) {
            $query->orderBy("nasabah_profiles.{$sortBy}", $sortDir);
        } else {
            $query->orderBy('nasabah_profiles.created_at', 'desc');
        }

        $nasabahs = $query->paginate($pageSize);

        return $this->paginatedResponse($nasabahs);
    }

    /**
     * Show a single nasabah.
     */
    public function show(Request $request, NasabahProfile $nasabah): JsonResponse
    {
        if ($nasabah->unit_id !== $request->unit_id) {
            return $this->errorResponse('Not found.', 404);
        }

        return $this->successResponse($nasabah->load('user'));
    }

    /**
     * Create a nasabah under the admin's unit.
     */
    public function store(StoreNasabahRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'phone' => $validated['phone'] ?? null,
        ]);

        $nasabahRole = Role::where('code', RoleCode::Nasabah->value)->firstOrFail();
        UserRole::create([
            'user_id' => $user->id,
            'role_id' => $nasabahRole->id,
            'unit_id' => $request->unit_id,
        ]);

        $profile = NasabahProfile::create([
            'user_id' => $user->id,
            'unit_id' => $request->unit_id,
            'alamat' => $validated['alamat'] ?? null,
        ]);

        return $this->createdResponse($profile->load('user'));
    }

    /**
     * Update a nasabah.
     */
    public function update(UpdateNasabahRequest $request, NasabahProfile $nasabah): JsonResponse
    {
        if ($nasabah->unit_id !== $request->unit_id) {
            return $this->errorResponse('Not found.', 404);
        }

        $validated = $request->validated();

        $nasabah->user->update(collect($validated)->only(['full_name', 'phone'])->toArray());

        if (isset($validated['alamat'])) {
            $nasabah->update(['alamat' => $validated['alamat']]);
        }

        return $this->successResponse($nasabah->fresh()->load('user'));
    }

    /**
     * Delete a nasabah.
     */
    public function destroy(Request $request, NasabahProfile $nasabah): JsonResponse
    {
        if ($nasabah->unit_id !== $request->unit_id) {
            return $this->errorResponse('Not found.', 404);
        }

        // Cascade: deleting user removes user_roles, nasabah_profile, setorans, etc.
        $nasabah->user->delete();

        return $this->noContentResponse();
    }
}
