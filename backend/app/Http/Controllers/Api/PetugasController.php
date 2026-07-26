<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PetugasController extends Controller
{
    /**
     * Dashboard statistics for petugas
     */
    public function dashboard()
    {
        $petugasId = auth()->guard('api')->user()->id;

        $stats = [
            'total_tasks' => Order::where('petugas_id', $petugasId)->count(),
            'pending_tasks' => Order::where('petugas_id', $petugasId)
                ->whereIn('status', ['assigned', 'on_the_way'])
                ->count(),
            'completed_today' => Order::where('petugas_id', $petugasId)
                ->where('status', 'completed')
                ->whereDate('completed_at', today())
                ->count(),
            'total_completed' => Order::where('petugas_id', $petugasId)
                ->where('status', 'completed')
                ->count(),
            'total_weight_collected' => Order::where('petugas_id', $petugasId)
                ->where('status', 'completed')
                ->sum('actual_weight'),
            'assigned_reports' => Report::where('assigned_to', $petugasId)
                ->where('status', 'in_progress')
                ->count(),
        ];

        // Today's schedule
        $today_schedule = Order::where('petugas_id', $petugasId)
            ->whereIn('status', ['assigned', 'on_the_way'])
            ->whereDate('scheduled_at', today())
            ->with(['customer:id,name,phone', 'address', 'wasteType:id,name'])
            ->orderBy('scheduled_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => $stats,
                'today_schedule' => $today_schedule,
            ]
        ]);
    }

    /**
     * Get assigned tasks (orders)
     */
    public function getTasks(Request $request)
    {
        $petugasId = auth()->id();
        $query = Order::where('petugas_id', $petugasId)
            ->with(['customer:id,name,phone', 'address', 'wasteType:id,name']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            // By default, show active tasks
            $query->whereIn('status', ['assigned', 'on_the_way', 'collected']);
        }

        // Filter by date
        if ($request->has('date')) {
            $query->whereDate('scheduled_at', $request->date);
        }

        $tasks = $query->orderBy('scheduled_at')->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $tasks
        ]);
    }

    /**
     * Get task detail
     */
    public function getTaskDetail($orderId)
    {
        $petugasId = auth()->guard('api')->user()->id;

        $order = Order::where('id', $orderId)
            ->where('petugas_id', $petugasId)
            ->with(['customer:id,name,phone,email', 'address', 'wasteType', 'payment'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Accept task and mark as on the way
     */
    public function acceptTask($orderId)
    {
        $petugasId = auth()->id();

        $order = Order::where('id', $orderId)
            ->where('petugas_id', $petugasId)
            ->where('status', 'assigned')
            ->firstOrFail();

        $order->markAsOnTheWay();

        return response()->json([
            'success' => true,
            'message' => 'Task accepted, you are now on the way',
            'data' => $order->fresh(['customer', 'address', 'wasteType'])
        ]);
    }

    /**
     * Mark task as collected and upload photo
     */
    public function markAsCollected(Request $request, $orderId)
    {
        $validator = Validator::make($request->all(), [
            'actual_weight' => 'required|numeric|min:0.1',
            'photo' => 'required|string', // base64 image
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $petugasId = auth()->id();

        $order = Order::where('id', $orderId)
            ->where('petugas_id', $petugasId)
            ->where('status', 'on_the_way')
            ->with('wasteType')
            ->firstOrFail();

        // Handle photo upload
        $photoPath = null;
        if ($request->photo) {
            $image = $request->photo;
            $image = str_replace('data:image/png;base64,', '', $image);
            $image = str_replace('data:image/jpg;base64,', '', $image);
            $image = str_replace('data:image/jpeg;base64,', '', $image);
            $image = str_replace(' ', '+', $image);
            $imageName = 'collection_' . $orderId . '_' . time() . '.jpg';
            Storage::put('public/collection_photos/' . $imageName, base64_decode($image));
            $photoPath = 'collection_photos/' . $imageName;
        }

        // Update order with actual weight and photo
        $order->actual_weight = $request->actual_weight;
        $order->collection_photo = $photoPath;
        $order->collection_notes = $request->notes;

        // Recalculate price and points based on actual weight
        $order->actual_price = $order->wasteType->calculatePrice($request->actual_weight);
        $order->actual_points = $order->wasteType->calculatePoints($request->actual_weight);

        $order->markAsCollected();

        return response()->json([
            'success' => true,
            'message' => 'Waste collected successfully',
            'data' => $order->fresh(['customer', 'wasteType'])
        ]);
    }

    /**
     * Mark task as completed (after customer confirmation)
     */
    public function completeTask($orderId)
    {
        $petugasId = auth()->id();

        $order = Order::where('id', $orderId)
            ->where('petugas_id', $petugasId)
            ->where('status', 'collected')
            ->firstOrFail();

        $order->markAsCompleted();

        return response()->json([
            'success' => true,
            'message' => 'Task completed successfully',
            'data' => $order->fresh()
        ]);
    }

    /**
     * Get task history
     */
    public function taskHistory(Request $request)
    {
        $petugasId = auth()->id();

        $query = Order::where('petugas_id', $petugasId)
            ->where('status', 'completed')
            ->with(['customer:id,name', 'wasteType:id,name']);

        if ($request->has('date_from')) {
            $query->whereDate('completed_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('completed_at', '<=', $request->date_to);
        }

        $history = $query->latest('completed_at')
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $history
        ]);
    }

    /**
     * Get assigned reports for waste cleanup
     */
    public function getReports(Request $request)
    {
        $petugasId = auth()->id();

        $query = Report::where('assigned_to', $petugasId)
            ->with('reporter:id,name,phone');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        } else {
            $query->whereIn('status', ['assigned', 'in_progress']);
        }

        $reports = $query->latest()->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }

    /**
     * Accept report and start processing
     */
    public function acceptReport($reportId)
    {
        $petugasId = auth()->id();

        $report = Report::where('id', $reportId)
            ->where('assigned_to', $petugasId)
            ->where('status', 'assigned')
            ->firstOrFail();

        $report->status = 'in_progress';
        $report->save();

        return response()->json([
            'success' => true,
            'message' => 'Report accepted',
            'data' => $report
        ]);
    }

    /**
     * Mark report as resolved with photo
     */
    public function resolveReport(Request $request, $reportId)
    {
        $validator = Validator::make($request->all(), [
            'resolution_photo' => 'required|string', // base64 image
            'resolution_notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $petugasId = auth()->id();

        $report = Report::where('id', $reportId)
            ->where('assigned_to', $petugasId)
            ->where('status', 'in_progress')
            ->firstOrFail();

        // Handle photo upload
        $photoPath = null;
        if ($request->resolution_photo) {
            $image = $request->resolution_photo;
            $image = str_replace('data:image/png;base64,', '', $image);
            $image = str_replace('data:image/jpg;base64,', '', $image);
            $image = str_replace('data:image/jpeg;base64,', '', $image);
            $image = str_replace(' ', '+', $image);
            $imageName = 'resolution_' . $reportId . '_' . time() . '.jpg';
            Storage::put('public/resolution_photos/' . $imageName, base64_decode($image));
            $photoPath = 'resolution_photos/' . $imageName;
        }

        $report->resolution_photo = $photoPath;
        $report->resolution_notes = $request->resolution_notes;
        $report->markAsResolved();

        return response()->json([
            'success' => true,
            'message' => 'Report resolved successfully',
            'data' => $report
        ]);
    }

    /**
     * Get performance statistics
     */
    public function performance()
    {
        $petugasId = auth()->id();

        $thisMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();

        $stats = [
            'this_month' => [
                'completed' => Order::where('petugas_id', $petugasId)
                    ->where('status', 'completed')
                    ->where('completed_at', '>=', $thisMonth)
                    ->count(),
                'weight_collected' => Order::where('petugas_id', $petugasId)
                    ->where('status', 'completed')
                    ->where('completed_at', '>=', $thisMonth)
                    ->sum('actual_weight'),
            ],
            'last_month' => [
                'completed' => Order::where('petugas_id', $petugasId)
                    ->where('status', 'completed')
                    ->whereBetween('completed_at', [$lastMonth, $thisMonth])
                    ->count(),
                'weight_collected' => Order::where('petugas_id', $petugasId)
                    ->where('status', 'completed')
                    ->whereBetween('completed_at', [$lastMonth, $thisMonth])
                    ->sum('actual_weight'),
            ],
            'total_completed' => Order::where('petugas_id', $petugasId)
                ->where('status', 'completed')
                ->count(),
            'average_rating' => \App\Models\Review::getAverageRatingForPetugas($petugasId),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    // Unused resource methods
    public function index() { return response()->json(['success' => false], 405); }
    public function store(Request $request) { return response()->json(['success' => false], 405); }
    public function show(string $id) { return response()->json(['success' => false], 405); }
    public function update(Request $request, string $id) { return response()->json(['success' => false], 405); }
    public function destroy(string $id) { return response()->json(['success' => false], 405); }
}
