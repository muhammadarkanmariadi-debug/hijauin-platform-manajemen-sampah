<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\WasteType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function getWasteTypes()
    {
        $wasteTypes = WasteType::all();
        return response()->json(['success' => true, 'data' => $wasteTypes]);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Order::with(['customer', 'address', 'wasteType', 'assignedPetugas']);

        if ($user->isCustomer()) {
            $query->where('customer_id', $user->id);
        } elseif ($user->isPetugas()) {
            $query->where('assigned_petugas_id', $user->id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('scheduled_time', 'desc')->paginate($request->per_page ?? 15);

        return response()->json(['success' => true, 'data' => $orders]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'address_id' => 'required|exists:addresses,id',
            'waste_type_id' => 'required|exists:waste_types,id',
            'estimated_weight_kg' => 'required|numeric|min:0.1',
            'scheduled_time' => 'required|date|after:now',
            'payment_method' => 'required|in:cash,ewallet,transfer,cod',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $wasteType = WasteType::find($request->waste_type_id);

        $order = Order::create([
            'customer_id' => $user->id,
            'address_id' => $request->address_id,
            'waste_type_id' => $request->waste_type_id,
            'estimated_weight_kg' => $request->estimated_weight_kg,
            'scheduled_time' => $request->scheduled_time,
            'price' => $wasteType->calculatePrice($request->estimated_weight_kg),
            'points_awarded' => $wasteType->calculatePoints($request->estimated_weight_kg),
            'payment_method' => $request->payment_method,
            'customer_notes' => $request->customer_notes,
        ]);

        return response()->json(['success' => true, 'data' => $order], 201);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $query = Order::with(['customer', 'address', 'wasteType', 'assignedPetugas', 'review']);

        if ($user->isCustomer()) {
            $query->where('customer_id', $user->id);
        } elseif ($user->isPetugas()) {
            $query->where('assigned_petugas_id', $user->id);
        }

        $order = $query->find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $order]);
    }

    public function update(Request $request, $id)
    {
        $order = Order::where('customer_id', $request->user()->id)
                     ->where('status', 'pending')
                     ->find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Cannot update order'], 404);
        }

        $order->update($request->only(['scheduled_time', 'customer_notes']));
        return response()->json(['success' => true, 'data' => $order]);
    }

    public function destroy(Request $request, $id)
    {
        $order = Order::where('customer_id', $request->user()->id)
                     ->whereIn('status', ['pending', 'assigned'])
                     ->find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Cannot cancel order'], 404);
        }

        $order->update(['status' => 'cancelled']);
        return response()->json(['success' => true, 'message' => 'Order cancelled']);
    }

    public function cancelOrder(Request $request, $id){
        $order = Order::where('customer_id', $request->user()->id)
                     ->whereIn('status', ['pending', 'assigned'])
                     ->find($id);

        if (!$order) {
            return response()->json(['success' => false, 'message' => 'Cannot cancel order'], 404);
        }

        $order->update(['status' => 'cancelled']);
        return response()->json(['success' => true, 'message' => 'Order cancelled']);
    }
}
