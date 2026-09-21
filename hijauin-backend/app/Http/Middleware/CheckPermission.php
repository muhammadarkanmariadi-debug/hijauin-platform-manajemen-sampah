<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\UserRole;
use App\Models\RolePermission;

/**
 * Data-driven permission guard.
 *
 * Usage in routes: ->middleware('permission:manage_nasabah')
 *
 * Looks up the user's effective permissions via the RBAC join chain
 * (user_roles → role_permissions → permissions). No hardcoded role-name
 * checks — permission mapping stays data-driven per AGENT.md §RBAC.
 */
class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
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

        // Get all role IDs the user holds
        $roleIds = UserRole::where('user_id', $user->id)->pluck('role_id');

        // Check if any of those roles have the required permission
        $hasPermission = RolePermission::whereIn('role_id', $roleIds)
            ->whereHas('permission', function ($query) use ($permission) {
                $query->where('code', $permission);
            })
            ->exists();

        if (!$hasPermission) {
            return response()->json([
                'statusCode' => 403,
                'success' => false,
                'message' => 'You do not have permission to perform this action.',
                'errors' => [],
                'timestamp' => now()->toISOString(),
            ], 403);
        }

        return $next($request);
    }
}
