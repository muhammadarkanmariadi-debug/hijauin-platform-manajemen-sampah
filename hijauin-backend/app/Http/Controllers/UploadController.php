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

        $bucket = config('filesystems.disks.s3.bucket');
        $s3Key = config('filesystems.disks.s3.key');
        $hasS3Config = !empty($bucket) && !empty($s3Key);
        $disk = $hasS3Config ? 's3' : 'public';

        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

        try {
            // Do not pass 'visibility' => 'public' for S3 because modern S3 buckets disable ACLs
            // (Bucket Owner Enforced) and rely on S3 Bucket Policy for public access.
            $storeOptions = $disk === 's3' ? ['disk' => 's3'] : ['disk' => 'public', 'visibility' => 'public'];
            $path = $file->storeAs($folder, $filename, $storeOptions);

            if (!$path) {
                throw new \RuntimeException("Storage::storeAs gagal menyimpan file pada disk: [{$disk}]");
            }

            $url = Storage::disk($disk)->url($path);

            // Ensure absolute S3 URL if Flysystem returned a relative path
            if ($disk === 's3' && (!str_starts_with($url, 'http://') && !str_starts_with($url, 'https://'))) {
                $region = config('filesystems.disks.s3.region', 'ap-southeast-2');
                $url = "https://{$bucket}.s3.{$region}.amazonaws.com/" . ltrim($path, '/');
            }

        } catch (\Throwable $e) {
            // Fallback to local public disk if S3 fails
            if ($disk === 's3') {
                try {
                    $disk = 'public';
                    $path = $file->storeAs($folder, $filename, [
                        'disk' => 'public',
                        'visibility' => 'public',
                    ]);
                    $url = Storage::disk('public')->url($path);
                } catch (\Throwable $fallbackErr) {
                    return $this->errorResponse('Gagal mengunggah file: ' . $fallbackErr->getMessage(), 500);
                }
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
