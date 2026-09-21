<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserRole;
use App\Models\Role;
use App\Models\NasabahProfile;
use App\Models\BankSampahUnit;
use App\Enums\RoleCode;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\GoogleAuthRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new nasabah account under a specific unit.
     * Returns 201 per TRD §3.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::create([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'phone' => $validated['phone'] ?? null,
        ]);

        // Assign nasabah role scoped to the unit
        $nasabahRole = Role::where('code', RoleCode::Nasabah->value)->firstOrFail();
        UserRole::create([
            'user_id' => $user->id,
            'role_id' => $nasabahRole->id,
            'unit_id' => $validated['unit_id'],
        ]);

        // Create nasabah profile
        NasabahProfile::create([
            'user_id' => $user->id,
            'unit_id' => $validated['unit_id'],
            'alamat' => $validated['alamat'] ?? null,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->createdResponse([
            'user' => $user->load(['userRoles.role', 'userRoles.unit', 'nasabahProfile.unit']),
            'token' => $token,
        ]);
    }

    /**
     * Login — returns 200, NOT 201 (see AGENT.md known bugs).
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => $user->load(['userRoles.role', 'userRoles.unit', 'nasabahProfile.unit']),
            'token' => $token,
        ]);
    }

    /**
     * Get authenticated user info.
     */
    public function me(Request $request): JsonResponse
    {
        return $this->successResponse(
            $request->user()->load(['userRoles.role', 'userRoles.unit', 'nasabahProfile.unit'])
        );
    }

    /**
     * Logout — revoke current token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(['message' => 'Logged out successfully.']);
    }

    /**
     * Google Sign-in / Sign-up endpoint.
     * Finds existing user by email or creates a new nasabah account.
     */
    public function google(GoogleAuthRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            // Pick requested unit or default to first available unit
            $unitId = $validated['unit_id'] ?? BankSampahUnit::value('id') ?? 1;

            $user = User::create([
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'password' => Hash::make(Str::random(24)),
                'photo_url' => $validated['photo_url'] ?? null,
            ]);

            // Attach Nasabah role
            $nasabahRole = Role::where('code', RoleCode::Nasabah->value)->first();
            if ($nasabahRole) {
                UserRole::create([
                    'user_id' => $user->id,
                    'role_id' => $nasabahRole->id,
                    'unit_id' => $unitId,
                ]);
            }

            // Create Nasabah profile
            NasabahProfile::create([
                'user_id' => $user->id,
                'unit_id' => $unitId,
                'saldo_poin' => 0,
            ]);
        } else if (!empty($validated['photo_url']) && empty($user->photo_url)) {
            $user->update(['photo_url' => $validated['photo_url']]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->successResponse([
            'user' => $user->load(['userRoles.role', 'userRoles.unit', 'nasabahProfile.unit']),
            'token' => $token,
        ]);
    }

    /**
     * Get list of active Bank Sampah Units for registration.
     */
    public function units(): JsonResponse
    {
        $units = BankSampahUnit::select('id', 'nama', 'alamat', 'telepon', 'deskripsi')->get();

        return $this->successResponse($units);
    }
}
