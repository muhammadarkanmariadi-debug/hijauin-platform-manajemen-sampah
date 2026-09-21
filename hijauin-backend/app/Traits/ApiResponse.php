<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Standard API response helpers matching TRD §3 conventions.
 *
 * Success:  { data, meta? }
 * Error:    { statusCode, success: false, message, errors[], timestamp }
 * Paginated: { data, meta: { page, pageSize, total } }
 */
trait ApiResponse
{
    protected function successResponse(mixed $data, int $code = 200, array $meta = []): JsonResponse
    {
        $response = ['data' => $data];

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $code);
    }

    protected function createdResponse(mixed $data): JsonResponse
    {
        return $this->successResponse($data, 201);
    }

    protected function noContentResponse(): JsonResponse
    {
        return response()->json(null, 204);
    }

    protected function paginatedResponse(LengthAwarePaginator $paginator, string $resourceClass = null): JsonResponse
    {
        $data = $resourceClass
            ? $resourceClass::collection($paginator->items())
            : $paginator->items();

        return response()->json([
            'data' => $data,
            'meta' => [
                'page' => $paginator->currentPage(),
                'pageSize' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    protected function errorResponse(string $message, int $code = 400, array $errors = []): JsonResponse
    {
        $response = [
            'statusCode' => $code,
            'success' => false,
            'message' => $message,
            'errors' => $errors,
            'timestamp' => now()->toISOString(),
        ];

        return response()->json($response, $code);
    }
}
