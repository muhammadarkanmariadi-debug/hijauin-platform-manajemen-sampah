<?php

namespace App\Http\Controllers\Nasabah;

use App\Http\Requests\Nasabah\UpdateProfilRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProfilController extends Controller
{
    /**
     * Show current nasabah profile with point balance.
     */
    public function show(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $cacheKey = "nasabah:profil:u{$userId}";

        $data = Cache::remember($cacheKey, 3600, function () use ($request) {
            $user = $request->user()->load('nasabahProfile.unit');

            return [
                'user' => $user,
                'profile' => $user->nasabahProfile,
            ];
        });

        return $this->successResponse($data);
    }

    /**
     * Update nasabah profile.
     */
    public function update(UpdateProfilRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = $request->user();

        // Update user-level fields
        $user->update(collect($validated)->only(['full_name', 'phone', 'photo_url'])->toArray());

        // Update profile-level fields
        if (isset($validated['alamat'])) {
            $user->nasabahProfile->update(['alamat' => $validated['alamat']]);
        }

        // Invalidate profile cache
        Cache::forget("nasabah:profil:u{$user->id}");

        return $this->successResponse(
            $user->fresh()->load('nasabahProfile')
        );
    }
}
