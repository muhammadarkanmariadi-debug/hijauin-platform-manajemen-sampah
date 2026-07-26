<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    /**
     * Display a listing of reports
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Report::with(['reporter', 'assignedTo']);

        // Show only user's reports for customers
        if ($user->isCustomer()) {
            $query->where('reporter_id', $user->id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by city
        if ($request->has('city')) {
            $query->where('city', $request->city);
        }

        $reports = $query->orderBy('created_at', 'desc')
                        ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }

    /**
     * Store a newly created report
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:200',
            'description' => 'required|string',
            'photo' => 'required|image|max:10240', // 10MB max
            'location_address' => 'required|string',
            'kelurahan' => 'nullable|string|max:100',
            'kecamatan' => 'nullable|string|max:100',
            'city' => 'required|string|max:100',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'priority' => 'nullable|in:low,medium,high',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Upload photo
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('report_photos', 'public');
        }

        // Create report
        $report = Report::create([
            'reporter_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'photo_url' => $photoPath,
            'location_address' => $request->location_address,
            'kelurahan' => $request->kelurahan,
            'kecamatan' => $request->kecamatan,
            'city' => $request->city,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'priority' => $request->priority ?? 'medium',
            'status' => 'open',
        ]);

        $report->load('reporter');

        return response()->json([
            'success' => true,
            'message' => 'Report submitted successfully. Thank you for helping keep our environment clean!',
            'data' => $report
        ], 201);
    }

    /**
     * Display the specified report
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $query = Report::with(['reporter', 'assignedTo']);

        // Customers can only view their own reports
        if ($user->isCustomer()) {
            $query->where('reporter_id', $user->id);
        }

        $report = $query->find($id);

        if (!$report) {
            return response()->json([
                'success' => false,
                'message' => 'Report not found'
            ], 404);
        }

        // Add photo URL
        if ($report->photo_url) {
            $report->photo_url = Storage::url($report->photo_url);
        }

        return response()->json([
            'success' => true,
            'data' => $report
        ]);
    }

    /**
     * Get my reports (customer)
     */
    public function myReports(Request $request)
    {
        $user = $request->user();

        $reports = Report::where('reporter_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }
}
