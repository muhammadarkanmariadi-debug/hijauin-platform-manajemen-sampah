<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\UserRole;
use App\Models\BankSampahUnit;
use App\Enums\RoleCode;

/**
 * Resolves the authenticated user's unit_id from user_roles and attaches it
 * to the request. Controllers read $request->unit_id — they never look up
 * unit_id themselves or accept it blindly from client input.
 *
 * For platform_ops (superusers), they have global scope and can optionally
 * filter by unit_id or default to all units.
 */
class ResolveUnitScope
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'statusCode' => 401,
                'success' => false,
                'message' => 'Unauthenticated.',
                'errors' => [],
                'timestamp' => now()->toISOString(),
            ], 401);
        }

        // Platform Ops superusers have global scope across all units
        if ($user->hasRole(RoleCode::PlatformOps->value)) {
            $unitId = $request->input('unit_id') ?? $request->header('X-Unit-ID') ?? BankSampahUnit::first()?->id ?? 1;
            $request->merge(['unit_id' => (int) $unitId, 'is_platform_ops' => true]);
            return $next($request);
        }

        // Regular unit admins and nasabahs are bound to their assigned branch unit
        $userRole = UserRole::where('user_id', $user->id)
            ->whereNotNull('unit_id')
            ->first();

        if (!$userRole) {
            return response()->json([
                'statusCode' => 403,
                'success' => false,
                'message' => 'User is not assigned to any unit.',
                'errors' => [],
                'timestamp' => now()->toISOString(),
            ], 403);
        }

        $request->merge(['unit_id' => $userRole->unit_id]);

        return $next($request);
    }
}
