<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Nasabah\SetoranController;
use App\Http\Controllers\Nasabah\PenukaranController;
use App\Http\Controllers\Nasabah\ProfilController;
use App\Http\Controllers\Admin\NasabahController as AdminNasabahController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\HadiahController;
use App\Http\Controllers\Admin\VerifikasiController;
use App\Http\Controllers\Admin\RekapController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Route groups follow the RBAC model from AGENT.md / TRD.md:
| - Public: auth endpoints (no middleware)
| - Nasabah: unit-scoped, requires nasabah role
| - Admin: unit-scoped, requires admin_unit role
|
| All list endpoints are paginated (AGENT.md rule #4).
| unit_id is resolved server-side via ResolveUnitScope middleware (rule #1).
|
*/

// ── Public ──────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/google', [AuthController::class, 'google']);
    Route::get('/units', [AuthController::class, 'units']);
});

Route::get('/units', [AuthController::class, 'units']);

// ── Authenticated ───────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Current user
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // ── Nasabah ─────────────────────────────────────────
    Route::middleware('unit.scope')
        ->prefix('nasabah')
        ->group(function () {
            Route::get('/profil', [ProfilController::class, 'show']);
            Route::put('/profil', [ProfilController::class, 'update']);
            Route::get('/kategoris', [SetoranController::class, 'kategoris']);
            Route::get('/hadiahs', [PenukaranController::class, 'hadiahs']);

            Route::apiResource('setorans', SetoranController::class)
                ->only(['index', 'store', 'show']);

            Route::apiResource('penukarans', PenukaranController::class)
                ->only(['index', 'store', 'show']);
        });

    // ── Admin Unit ──────────────────────────────────────
    Route::middleware('unit.scope')
        ->prefix('admin')
        ->group(function () {
            Route::apiResource('nasabahs', AdminNasabahController::class);
            Route::apiResource('kategoris', KategoriController::class);
            Route::apiResource('hadiahs', HadiahController::class);

            Route::post('/setorans/{setoran}/verify', [VerifikasiController::class, 'verify']);
            Route::get('/setorans', [VerifikasiController::class, 'index']);
            Route::get('/rekap', [RekapController::class, 'index']);
        });

    // ── Platform Ops (Superuser Management) ─────────────
    Route::prefix('ops')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Admin\OpsController::class, 'dashboard']);
        Route::get('/users', [\App\Http\Controllers\Admin\OpsController::class, 'users']);
        Route::post('/users', [\App\Http\Controllers\Admin\OpsController::class, 'storeUser']);
        Route::put('/users/{user}', [\App\Http\Controllers\Admin\OpsController::class, 'updateUser']);
        Route::delete('/users/{user}', [\App\Http\Controllers\Admin\OpsController::class, 'deleteUser']);

        Route::get('/roles', [\App\Http\Controllers\Admin\OpsController::class, 'roles']);
        Route::get('/units', [\App\Http\Controllers\Admin\OpsController::class, 'units']);
        Route::post('/units', [\App\Http\Controllers\Admin\OpsController::class, 'storeUnit']);
    });
});
