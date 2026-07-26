<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Report;
use App\Models\WasteType;
use App\Models\EducationalContent;
use App\Models\PaymentTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    /**
     * Dashboard statistics
     */
    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_petugas' => User::where('role', 'petugas')->count(),
            'total_partners' => User::where('role', 'partner')->count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'completed_orders' => Order::where('status', 'completed')->count(),
            'total_reports' => Report::count(),
            'pending_reports' => Report::where('status', 'pending')->count(),
            'total_revenue' => PaymentTransaction::where('status', 'paid')->sum('amount'),
            'total_waste_collected' => Order::where('status', 'completed')->sum('estimated_weight_kg'),
            'total_points_awarded' => User::sum('hijau_points'),
        ];

        // Recent orders
        $recent_orders = Order::with(['customer:id,name', 'petugas:id,name', 'wasteType:id,name'])
            ->latest()
            ->limit(10)
            ->get();

        // Recent reports
        $recent_reports = Report::with('reporter:id,name')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'statistics' => $stats,
                'recent_orders' => $recent_orders,
                'recent_reports' => $recent_reports,
            ]
        ]);
    }

    /**
     * Get analytics data
     */
    public function analytics(Request $request)
    {
        $period = $request->get('period', 'week'); // day, week, month, year

        $dateFormat = match($period) {
            'day' => '%Y-%m-%d %H:00:00',
            'week' => '%Y-%m-%d',
            'month' => '%Y-%m-%d',
            'year' => '%Y-%m',
        };

        $startDate = match($period) {
            'day' => now()->startOfDay(),
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
        };

        // Order statistics
        $order_stats = Order::where('created_at', '>=', $startDate)
            ->selectRaw("DATE_FORMAT(created_at, '{$dateFormat}') as date")
            ->selectRaw('COUNT(*) as total')
            ->selectRaw("SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed")
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Revenue statistics
        $revenue_stats = PaymentTransaction::where('created_at', '>=', $startDate)
            ->where('status', 'paid')
            ->selectRaw("DATE_FORMAT(created_at, '{$dateFormat}') as date")
            ->selectRaw('SUM(amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Waste collection by type
        $waste_by_type = Order::where('status', 'completed')
            ->where('completed_at', '>=', $startDate)
            ->join('waste_types', 'orders.waste_type_id', '=', 'waste_types.id')
            ->selectRaw('waste_types.name as type')
            ->selectRaw('SUM(orders.actual_weight) as total_weight')
            ->groupBy('waste_types.id', 'waste_types.name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => $order_stats,
                'revenue' => $revenue_stats,
                'waste_collection' => $waste_by_type,
            ]
        ]);
    }

    // ==================== USER MANAGEMENT ====================

    /**
     * Get all users with filters
     */
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Get single user detail
     */
    public function userDetail($id)
    {
        $user = User::with(['addresses', 'orders', 'subscriptions', 'reports'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update user status
     */
    public function updateUserStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,inactive,suspended',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::findOrFail($id);
        $user->status = $request->status;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully',
            'data' => $user
        ]);
    }

    /**
     * Delete user
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete admin user'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    // ==================== ORDER MANAGEMENT ====================

    /**
     * Get all orders with filters
     */
    public function orders(Request $request)
    {
        $query = Order::with(['customer:id,name', 'petugas:id,name', 'wasteType:id,name', 'address']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->has('petugas_id')) {
            $query->where('petugas_id', $request->petugas_id);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->latest()->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Manually assign order to petugas
     */
    public function assignOrder(Request $request, $orderId)
    {
        $validator = Validator::make($request->all(), [
            'petugas_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $order = Order::findOrFail($orderId);

        if ($order->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending orders can be assigned'
            ], 400);
        }

        $petugas = User::where('id', $request->petugas_id)
            ->where('role', 'petugas')
            ->where('status', 'active')
            ->firstOrFail();

        $order->assignToPetugas($petugas->id);

        return response()->json([
            'success' => true,
            'message' => 'Order assigned successfully',
            'data' => $order->fresh(['customer', 'petugas', 'wasteType'])
        ]);
    }

    /**
     * Cancel order
     */
    public function cancelOrder($orderId)
    {
        $order = Order::findOrFail($orderId);

        if (in_array($order->status, ['completed', 'cancelled'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot cancel completed or already cancelled order'
            ], 400);
        }

        $order->status = 'cancelled';
        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled successfully',
            'data' => $order
        ]);
    }

    // ==================== REPORT MANAGEMENT ====================

    /**
     * Get all reports with filters
     */
    public function reports(Request $request)
    {
        $query = Report::with(['reporter:id,name', 'assignedTo:id,name']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        $reports = $query->latest()->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }

    /**
     * Assign report to petugas
     */
    public function assignReport(Request $request, $reportId)
    {
        $validator = Validator::make($request->all(), [
            'petugas_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $report = Report::findOrFail($reportId);

        $petugas = User::where('id', $request->petugas_id)
            ->where('role', 'petugas')
            ->where('status', 'active')
            ->firstOrFail();

        $report->assignTo($petugas->id);

        return response()->json([
            'success' => true,
            'message' => 'Report assigned successfully',
            'data' => $report->fresh(['reporter', 'assignedTo'])
        ]);
    }

    /**
     * Update report priority
     */
    public function updateReportPriority(Request $request, $reportId)
    {
        $validator = Validator::make($request->all(), [
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $report = Report::findOrFail($reportId);
        $report->priority = $request->priority;
        $report->save();

        return response()->json([
            'success' => true,
            'message' => 'Report priority updated successfully',
            'data' => $report
        ]);
    }

    // ==================== WASTE TYPE MANAGEMENT ====================

    /**
     * Get all waste types
     */
    public function wasteTypes()
    {
        $wasteTypes = WasteType::all();

        return response()->json([
            'success' => true,
            'data' => $wasteTypes
        ]);
    }

    /**
     * Create waste type
     */
    public function createWasteType(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:waste_types',
            'description' => 'nullable|string',
            'price_per_kg' => 'required|numeric|min:0',
            'point_per_kg' => 'required|integer|min:0',
            'icon' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $wasteType = WasteType::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Waste type created successfully',
            'data' => $wasteType
        ], 201);
    }

    /**
     * Update waste type
     */
    public function updateWasteType(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:waste_types,name,' . $id,
            'description' => 'nullable|string',
            'price_per_kg' => 'required|numeric|min:0',
            'point_per_kg' => 'required|integer|min:0',
            'icon' => 'nullable|string',
            'color' => 'nullable|string|max:7',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $wasteType = WasteType::findOrFail($id);
        $wasteType->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Waste type updated successfully',
            'data' => $wasteType
        ]);
    }

    /**
     * Delete waste type
     */
    public function deleteWasteType($id)
    {
        $wasteType = WasteType::findOrFail($id);

        // Check if waste type is used in orders
        if ($wasteType->orders()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete waste type that is used in orders'
            ], 400);
        }

        $wasteType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Waste type deleted successfully'
        ]);
    }

    // ==================== EDUCATIONAL CONTENT MANAGEMENT ====================

    /**
     * Get all educational contents (including unpublished)
     */
    public function educationalContents(Request $request)
    {
        $query = EducationalContent::with('author:id,name');

        if ($request->has('status')) {
            if ($request->status === 'published') {
                $query->published();
            } else {
                $query->where('status', 'draft');
            }
        }

        $contents = $query->latest()->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $contents
        ]);
    }

    /**
     * Create educational content
     */
    public function createEducationalContent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:article,video,infographic,guide',
            'category' => 'required|string|max:100',
            'thumbnail' => 'nullable|string',
            'video_url' => 'nullable|url',
            'is_featured' => 'boolean',
            'status' => 'required|in:draft,published',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->title);
        $data['author_id'] = auth()->guard('api')->user()->id;

        if ($request->status === 'published' && !$request->has('published_at')) {
            $data['published_at'] = now();
        }

        $content = EducationalContent::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Educational content created successfully',
            'data' => $content
        ], 201);
    }

    /**
     * Update educational content
     */
    public function updateEducationalContent(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:article,video,infographic,guide',
            'category' => 'required|string|max:100',
            'thumbnail' => 'nullable|string',
            'video_url' => 'nullable|url',
            'is_featured' => 'boolean',
            'status' => 'required|in:draft,published',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $content = EducationalContent::findOrFail($id);

        $data = $request->all();
        $data['slug'] = Str::slug($request->title);

        if ($request->status === 'published' && $content->status === 'draft') {
            $data['published_at'] = now();
        }

        $content->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Educational content updated successfully',
            'data' => $content->fresh()
        ]);
    }

    /**
     * Delete educational content
     */
    public function deleteEducationalContent($id)
    {
        $content = EducationalContent::findOrFail($id);
        $content->delete();

        return response()->json([
            'success' => true,
            'message' => 'Educational content deleted successfully'
        ]);
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured($id)
    {
        $content = EducationalContent::findOrFail($id);
        $content->is_featured = !$content->is_featured;
        $content->save();

        return response()->json([
            'success' => true,
            'message' => 'Featured status updated',
            'data' => $content
        ]);
    }

    public function getOrders(Request $request){
        $order = Order::query();

        if ($request->has('status')) {
            $order->where('status', $request->status);
        }
        if ($request->has('customer_id')) {
            $order->where('customer_id', $request->customer_id);
        }

        return response()->json([
            'success' => true,
            'data' => $order->get()
        ]);
    }
}
