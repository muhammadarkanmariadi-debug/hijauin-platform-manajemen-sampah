<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use App\Http\Middleware\ResolveUnitScope;
use App\Http\Middleware\CheckPermission;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'unit.scope' => ResolveUnitScope::class,
            'permission' => CheckPermission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Enforce JSON responses for all requests — zero HTML error views
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => true,
        );

        // 422 Unprocessable Entity (Validation errors)
        $exceptions->render(function (ValidationException $e, Request $request) {
            return response()->json([
                'statusCode' => 422,
                'success' => false,
                'message' => 'Data yang dikirimkan tidak valid.',
                'errors' => $e->errors(),
                'timestamp' => now()->toISOString(),
            ], 422);
        });

        // 401 Unauthorized (Auth token expired or missing)
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'statusCode' => 401,
                'success' => false,
                'message' => 'Unauthenticated. Sesi login telah berakhir atau token tidak valid.',
                'errors' => [],
                'timestamp' => now()->toISOString(),
            ], 401);
        });

        // 404 Not Found (Missing model or invalid route)
        $exceptions->render(function (ModelNotFoundException|NotFoundHttpException $e, Request $request) {
            return response()->json([
                'statusCode' => 404,
                'success' => false,
                'message' => 'Data atau endpoint yang diminta tidak ditemukan.',
                'errors' => [],
                'timestamp' => now()->toISOString(),
            ], 404);
        });

        // 403 Forbidden (RBAC permission denied)
        $exceptions->render(function (AccessDeniedHttpException $e, Request $request) {
            return response()->json([
                'statusCode' => 403,
                'success' => false,
                'message' => $e->getMessage() ?: 'Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.',
                'errors' => [],
                'timestamp' => now()->toISOString(),
            ], 403);
        });

        // 405 Method Not Allowed
        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            return response()->json([
                'statusCode' => 405,
                'success' => false,
                'message' => 'Metode HTTP tidak diizinkan untuk endpoint ini.',
                'errors' => [],
                'timestamp' => now()->toISOString(),
            ], 405);
        });

        // Generic HTTP Exceptions
        $exceptions->render(function (HttpException $e, Request $request) {
            return response()->json([
                'statusCode' => $e->getStatusCode(),
                'success' => false,
                'message' => $e->getMessage() ?: 'Terjadi kesalahan HTTP.',
                'errors' => [],
                'timestamp' => now()->toISOString(),
            ], $e->getStatusCode());
        });

        // 500 Internal Server Error (Fallback for all unhandled throwables)
        $exceptions->render(function (\Throwable $e, Request $request) {
            $isDebug = config('app.debug', false);
            return response()->json([
                'statusCode' => 500,
                'success' => false,
                'message' => $isDebug ? $e->getMessage() : 'Terjadi kesalahan internal pada server.',
                'errors' => $isDebug ? [
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : [],
                'timestamp' => now()->toISOString(),
            ], 500);
        });
    })->create();
