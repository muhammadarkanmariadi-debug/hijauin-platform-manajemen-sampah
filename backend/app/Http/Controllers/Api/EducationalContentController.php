<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EducationalContent;
use Illuminate\Http\Request;

class EducationalContentController extends Controller
{
    /**
     * Display a listing of educational contents (Public)
     */
    public function index(Request $request)
    {
        $query = EducationalContent::published()->with('author:id,name');

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Search by title or content
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Featured only
        if ($request->has('featured') && $request->featured) {
            $query->where('is_featured', true);
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'published_at');
        $sortOrder = $request->get('sort_order', 'desc');

        if ($sortBy === 'popular') {
            $query->orderBy('view_count', 'desc');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $contents = $query->paginate($request->per_page ?? 12);

        return response()->json([
            'success' => true,
            'data' => $contents
        ]);
    }

    /**
     * Display the specified educational content (Public)
     */
    public function show($slug)
    {
        $content = EducationalContent::published()
            ->with('author:id,name')
            ->where('slug', $slug)
            ->first();

        if (!$content) {
            return response()->json([
                'success' => false,
                'message' => 'Content not found'
            ], 404);
        }

        // Increment view count
        $content->incrementViewCount();

        return response()->json([
            'success' => true,
            'data' => $content
        ]);
    }

    /**
     * Get featured contents (Public)
     */
    public function featured(Request $request)
    {
        $contents = EducationalContent::published()
            ->featured()
            ->with('author:id,name')
            ->limit($request->limit ?? 6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $contents
        ]);
    }

    /**
     * Get popular contents (Public)
     */
    public function popular(Request $request)
    {
        $contents = EducationalContent::published()
            ->popular($request->limit ?? 10)
            ->with('author:id,name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $contents
        ]);
    }

    /**
     * Get latest contents (Public)
     */
    public function latest(Request $request)
    {
        $contents = EducationalContent::published()
            ->with('author:id,name')
            ->orderBy('published_at', 'desc')
            ->limit($request->limit ?? 6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $contents
        ]);
    }

    // Admin methods would be in AdminController
    public function store(Request $request)
    {
        return response()->json(['success' => false, 'message' => 'Use admin endpoint'], 403);
    }

    public function update(Request $request, $id)
    {
        return response()->json(['success' => false, 'message' => 'Use admin endpoint'], 403);
    }

    public function destroy($id)
    {
        return response()->json(['success' => false, 'message' => 'Use admin endpoint'], 403);
    }
}
