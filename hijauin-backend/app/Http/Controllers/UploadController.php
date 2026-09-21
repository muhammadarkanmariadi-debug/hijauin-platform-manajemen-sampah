<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Upload an image/file to AWS S3 (or configured storage disk).
     */
    public function upload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|image|max:10240', // max 10MB
            'folder' => 'nullable|string|max:50',
        ]);

        $file = $request->file('file');
        $folder = $validated['folder'] ?? 'uploads';
        
        // Sanitize folder name
        $folder = trim(preg_replace('/[^a-zA-Z0-9_\-\/]/', '', $folder), '/');

        // Determine target disk: prefer 's3' if configured or fallback to public disk
        $disk = config('filesystems.default') === 's3' || env('AWS_BUCKET') ? 's3' : 'public';

        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs($folder, $filename, [
            'disk' => $disk,
            'visibility' => 'public',
        ]);

        $url = Storage::disk($disk)->url($path);

        return $this->successResponse([
            'url' => $url,
            'path' => $path,
            'disk' => $disk,
            'filename' => $filename,
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);
    }
}
