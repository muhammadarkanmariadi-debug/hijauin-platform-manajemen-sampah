<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\WasteType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of subscriptions
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $subscriptions = Subscription::where('customer_id', $user->id)
            ->with(['address', 'wasteType'])
            ->when($request->status, function($q, $status) {
                return $q->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $subscriptions
        ]);
    }

    /**
     * Store a newly created subscription
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address_id' => 'required|exists:addresses,id',
            'waste_type_id' => 'required|exists:waste_types,id',
            'plan_type' => 'required|in:weekly_2x,weekly_3x,daily,custom',
            'pickups_per_week' => 'required|integer|min:1|max:7',
            'pickup_days' => 'required|array|min:1',
            'pickup_days.*' => 'integer|between:0,6', // 0 = Sunday, 6 = Saturday
            'preferred_time' => 'required|date_format:H:i',
            'estimated_weight_per_pickup' => 'required|numeric|min:0.1',
            'payment_method' => 'required|in:auto_debit,monthly_invoice',
            'start_date' => 'required|date|after_or_equal:today',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Verify address belongs to user
        if (!$user->addresses()->where('id', $request->address_id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Address not found'
            ], 404);
        }

        $wasteType = WasteType::find($request->waste_type_id);

        // Calculate monthly price
        $pickupsPerMonth = $request->pickups_per_week * 4; // Approximate
        $pricePerPickup = $wasteType->calculatePrice($request->estimated_weight_per_pickup);
        $monthlyPrice = $pricePerPickup * $pickupsPerMonth;

        $subscription = Subscription::create([
            'customer_id' => $user->id,
            'address_id' => $request->address_id,
            'waste_type_id' => $request->waste_type_id,
            'plan_type' => $request->plan_type,
            'pickups_per_week' => $request->pickups_per_week,
            'pickup_days' => $request->pickup_days,
            'preferred_time' => $request->preferred_time,
            'estimated_weight_per_pickup' => $request->estimated_weight_per_pickup,
            'monthly_price' => $monthlyPrice,
            'payment_method' => $request->payment_method,
            'start_date' => $request->start_date,
            'status' => 'active',
        ]);

        // Calculate first pickup date
        $subscription->calculateNextPickupDate();

        $subscription->load(['address', 'wasteType']);

        return response()->json([
            'success' => true,
            'message' => 'Subscription created successfully',
            'data' => $subscription
        ], 201);
    }

    /**
     * Display the specified subscription
     */
    public function show(Request $request, $id)
    {
        $subscription = Subscription::where('customer_id', $request->user()->id)
            ->with(['address', 'wasteType', 'orders'])
            ->find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $subscription
        ]);
    }

    /**
     * Update the specified subscription
     */
    public function update(Request $request, $id)
    {
        $subscription = Subscription::where('customer_id', $request->user()->id)
            ->where('status', 'active')
            ->find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription not found or cannot be updated'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'pickup_days' => 'sometimes|array|min:1',
            'pickup_days.*' => 'integer|between:0,6',
            'preferred_time' => 'sometimes|date_format:H:i',
            'estimated_weight_per_pickup' => 'sometimes|numeric|min:0.1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $subscription->update($request->only([
            'pickup_days',
            'preferred_time',
            'estimated_weight_per_pickup'
        ]));

        // Recalculate next pickup if days changed
        if ($request->has('pickup_days')) {
            $subscription->calculateNextPickupDate();
        }

        return response()->json([
            'success' => true,
            'message' => 'Subscription updated successfully',
            'data' => $subscription
        ]);
    }

    /**
     * Pause subscription
     */
    public function pause(Request $request, $id)
    {
        $subscription = Subscription::where('customer_id', $request->user()->id)
            ->where('status', 'active')
            ->find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription not found or already paused'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'paused_until' => 'nullable|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $subscription->pause($request->paused_until);

        return response()->json([
            'success' => true,
            'message' => 'Subscription paused successfully',
            'data' => $subscription
        ]);
    }

    /**
     * Resume subscription
     */
    public function resume(Request $request, $id)
    {
        $subscription = Subscription::where('customer_id', $request->user()->id)
            ->where('status', 'paused')
            ->find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription not found or not paused'
            ], 404);
        }

        $subscription->resume();

        return response()->json([
            'success' => true,
            'message' => 'Subscription resumed successfully',
            'data' => $subscription
        ]);
    }

    /**
     * Cancel subscription
     */
    public function cancel(Request $request, $id)
    {
        $subscription = Subscription::where('customer_id', $request->user()->id)
            ->whereIn('status', ['active', 'paused'])
            ->find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription not found or already cancelled'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'cancellation_reason' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $subscription->cancel($request->cancellation_reason);

        return response()->json([
            'success' => true,
            'message' => 'Subscription cancelled successfully'
        ]);
    }

    /**
     * Delete (soft delete) subscription
     */
    public function destroy(Request $request, $id)
    {
        $subscription = Subscription::where('customer_id', $request->user()->id)
            ->where('status', 'cancelled')
            ->find($id);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription not found or cannot be deleted'
            ], 404);
        }

        $subscription->delete();

        return response()->json([
            'success' => true,
            'message' => 'Subscription deleted successfully'
        ]);
    }
}
