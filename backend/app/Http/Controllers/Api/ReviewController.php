<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $reviews = Review::where('customer_id', $user->id)
            ->with(['order', 'petugas'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json(['success' => true, 'data' => $reviews]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $order = Order::where('id', $request->order_id)
            ->where('customer_id', $user->id)
            ->where('status', 'completed')
            ->first();

        if (!$order || $order->review) {
            return response()->json(['success' => false, 'message' => 'Cannot review this order'], 400);
        }

        $review = Review::create([
            'order_id' => $order->id,
            'customer_id' => $user->id,
            'petugas_id' => $order->assigned_petugas_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'service_aspect' => 'overall',
        ]);

        return response()->json(['success' => true, 'data' => $review], 201);
    }

    public function show(Request $request, $id)
    {
        $review = Review::where('customer_id', $request->user()->id)->find($id);
        if (!$review) {
            return response()->json(['success' => false, 'message' => 'Review not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $review]);
    }

    public function update(Request $request, $id)
    {
        // Not implemented - reviews are immutable after creation
        return response()->json(['success' => false, 'message' => 'Reviews cannot be edited'], 403);
    }

    public function destroy($id)
    {
        // Not implemented - reviews are permanent
        return response()->json(['success' => false, 'message' => 'Reviews cannot be deleted'], 403);
    }
}
