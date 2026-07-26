<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\PetugasController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\EducationalContentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\api\WalletController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tymon\JWTAuth\Http\Middleware\Authenticate;

/*
|--------------------------------------------------------------------------
| API Routes - Hijauin Platform
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/forgot-password', 'forgotPassword');
    Route::post('/reset-password', 'resetPassword');
});

// Public educational content
Route::get('/education', [EducationalContentController::class, 'index']);
Route::get('/education/{slug}', [EducationalContentController::class, 'show']);

// Protected routes
Route::middleware([Authenticate::class])->group(function () {

    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

    // Customer routes
    Route::middleware(['role:customer'])->prefix('customer')->group(function () {
        // Waste Types (for order form)
        Route::get('waste-types', [OrderController::class, 'getWasteTypes']);

        // Addresses
        Route::apiResource('addresses', AddressController::class);
        Route::post('addresses/{id}/set-default', [AddressController::class, 'setDefault']);

        // Orders

        Route::apiResource('orders', OrderController::class);

        // Subscriptions
        Route::apiResource('subscriptions', SubscriptionController::class);
        Route::post('subscriptions/{id}/pause', [SubscriptionController::class, 'pause']);
        Route::post('subscriptions/{id}/resume', [SubscriptionController::class, 'resume']);
        Route::post('subscriptions/{id}/cancel', [SubscriptionController::class, 'cancel']);

        // Reports
        Route::put('orders/{orderId}/cancel', [OrderController::class, 'cancelOrder']);
        Route::apiResource('reports', ReportController::class)->except(['update', 'destroy']);

        // Reviews
        Route::post('orders/{orderId}/review', [ReviewController::class, 'store']);
        Route::get('reviews', [ReviewController::class, 'index']);

        // Points
        Route::get('points', function(Request $request) {
            $user = $request->user();
            $points = $user->hijauPoints()->with('pointable')->latest()->paginate(20);
            return response()->json(['success' => true, 'data' => $points]);
        });
    });

    // Petugas routes
    Route::middleware(['role:petugas'])->prefix('petugas')->group(function () {
        // Tasks / Orders assigned to petugas
        Route::get('dashboard', [PetugasController::class, 'dashboard']);
        Route::get('tasks', [PetugasController::class, 'getTasks']);
        Route::get('tasks/today', [PetugasController::class, 'getTasksToday']);
        Route::get('tasks/{id}', [PetugasController::class, 'getTaskDetail']);

        // Update task status
        Route::post('tasks/{id}/accept', [PetugasController::class, 'acceptTask']);
        Route::post('tasks/{id}/decline', [PetugasController::class, 'declineTask']);
        Route::post('tasks/{id}/start', [PetugasController::class, 'startTask']);
        Route::post('tasks/{id}/collect', [PetugasController::class, 'markAsCollected']);
        Route::post('tasks/{id}/complete', [PetugasController::class, 'completeTask']);
        Route::post('tasks/{id}/fail', [PetugasController::class, 'failTask']);

        // Upload pickup photo (handled in collect now, but keep route if needed)
        Route::post('tasks/{id}/upload-photo', [PetugasController::class, 'uploadPhoto']);

        // Reports assigned to petugas
        Route::get('reports', [PetugasController::class, 'getReports']);
        Route::post('reports/{id}/accept', [PetugasController::class, 'acceptReport']);
        Route::post('reports/{id}/resolve', [PetugasController::class, 'resolveReport']);

        // Profile & availability
        Route::get('profile', [PetugasController::class, 'getProfile']);
        Route::put('profile', [PetugasController::class, 'updateProfile']);
        Route::put('availability', [PetugasController::class, 'updateAvailability']);

        // Performance
        Route::get('statistics', [PetugasController::class, 'getStatistics']);
        Route::get('reviews', [PetugasController::class, 'getReviews']);
    });

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        // Dashboard & Statistics
        Route::get('dashboard', [AdminController::class, 'dashboard']);
        Route::get('statistics', [AdminController::class, 'statistics']);
        Route::get('analytics', [AdminController::class, 'analytics']);

        // User Management
        Route::get('users', [AdminController::class, 'users']);
        Route::get('users/{id}', [AdminController::class, 'getUser']);
        Route::put('users/{id}', [AdminController::class, 'updateUser']);
        Route::put('users/{id}/status', [AdminController::class, 'updateUserStatus']);
        Route::delete('users/{id}', [AdminController::class, 'deleteUser']);

        // Order Management
        Route::get('orders', [AdminController::class, 'getOrders']);
        Route::get('orders/{id}', [AdminController::class, 'getOrder']);
        Route::post('orders/{id}/assign', [AdminController::class, 'assignOrder']);
        Route::post('orders/{id}/reassign', [AdminController::class, 'reassignOrder']);

        // Report Management
        Route::get('reports', [AdminController::class, 'getReports']);
        Route::get('reports/{id}', [AdminController::class, 'getReport']);
        Route::post('reports/{id}/assign', [AdminController::class, 'assignReport']);
        Route::post('reports/{id}/resolve', [AdminController::class, 'resolveReport']);

        // Waste Types Management
        Route::get('waste-types', [AdminController::class, 'getWasteTypes']);
        Route::post('waste-types', [AdminController::class, 'createWasteType']);
        Route::put('waste-types/{id}', [AdminController::class, 'updateWasteType']);
        Route::delete('waste-types/{id}', [AdminController::class, 'deleteWasteType']);

        // Educational Content Management
        Route::post('education', [AdminController::class, 'createEducation']);
        Route::put('education/{id}', [AdminController::class, 'updateEducation']);
        Route::delete('education/{id}', [AdminController::class, 'deleteEducation']);
        Route::post('education/{id}/publish', [AdminController::class, 'publishEducation']);

        // Finance & Payments
        Route::get('payments', [AdminController::class, 'getPayments']);
        Route::get('finance/summary', [AdminController::class, 'getFinanceSummary']);

        // Reports & Export
        Route::get('export/orders', [AdminController::class, 'exportOrders']);
        Route::get('export/users', [AdminController::class, 'exportUsers']);
        Route::get('export/statistics', [AdminController::class, 'exportStatistics']);
    });

    // Partner routes
    Route::middleware(['role:partner'])->prefix('partner')->group(function () {
        Route::get('dashboard', function(Request $request) {
            return response()->json(['success' => true, 'message' => 'Partner dashboard']);
        });
    });

    // Wallet (existing)
    Route::get('/wallet', [WalletController::class, 'getWallet']);
});

// Fallback route
Route::fallback(function(){
    return response()->json([
        'success' => false,
        'message' => 'Endpoint not found'
    ], 404);
});



