<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (API-Only Backend)
|--------------------------------------------------------------------------
|
| All responses in Hijauin backend are strictly JSON formatted.
|
*/

Route::get('/', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'Hijauin Platform API',
        'version' => '2.0.0',
        'environment' => config('app.env'),
        'timestamp' => now()->toISOString(),
    ]);
});

Route::fallback(function () {
    return response()->json([
        'statusCode' => 404,
        'success' => false,
        'message' => 'Endpoint tidak ditemukan.',
        'errors' => [],
        'timestamp' => now()->toISOString(),
    ], 404);
});
