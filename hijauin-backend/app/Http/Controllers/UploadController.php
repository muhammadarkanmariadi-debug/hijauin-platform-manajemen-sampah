<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

        // Determine target disk: prefer 's3' if configured, fallback to 'public'
        $hasS3Config = !empty(config('filesystems.disks.s3.bucket')) && !empty(config('filesystems.disks.s3.key'));
        $disk = $hasS3Config ? 's3' : 'public';

        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        try {
            $path = $file->storeAs($folder, $filename, [
                'disk' => $disk,
                'visibility' => 'public',
            ]);


            

            if (!$path) {
                throw new \RuntimeException("Failed to store file on disk: {$disk}");
            }

            $url = Storage::disk($disk)->url($path);

            // Ensure absolute S3 URL if Flysystem returned a relative path
            if ($disk === 's3' && (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://'))) {
                $bucket = config('filesystems.disks.s3.bucket');
                $region = config('filesystems.disks.s3.region', 'ap-southeast-2');
                $url = "https://{$bucket}.s3.{$region}.amazonaws.com/" . ltrim($path, '/');
            }

            Log::info('File uploaded successfully', [
                'path' => $path,
                'url' => $url,
                'disk' => $disk,
                'filename' => $filename,
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ]);
        } catch (\Throwable $e) {
            // Fallback to local public disk if S3 network or permissions fail
            if ($disk === 's3') {
                $disk = 'public';
                $path = $file->storeAs($folder, $filename, [
                    'disk' => 'public',
                    'visibility' => 'public',
                ]);
                $url = Storage::disk('public')->url($path);
            } else {
                return $this->errorResponse('Gagal mengunggah file: ' . $e->getMessage(), 500);
            }
        }

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
