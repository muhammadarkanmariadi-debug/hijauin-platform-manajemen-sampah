/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import api from '@/lib/api';

interface S3ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  folder?: string;
  maxSizeMB?: number;
}

/**
 * Modern AWS S3 Image Upload Component.
 *
 * Conforms to docs/DESIGN.md:
 * - 4px radius, subtle hairlines
 * - Forest-950 and bone-100 color accents
 * - Drag and drop support with direct backend S3 upload
 * - Manual direct URL input fallback
 */
export default function S3ImageUpload({
  value,
  onChange,
  onRemove,
  label = 'Unggah Foto Bukti / Dokumen',
  folder = 'hijauin',
  maxSizeMB = 10,
}: S3ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Hanya file gambar (JPG, PNG, WebP) yang diperbolehkan.');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadError(`Ukuran file maksimal adalah ${maxSizeMB}MB.`);
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedUrl = response.data?.data?.url || response.data?.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
      } else {
        throw new Error('Gagal mendapatkan URL gambar dari server.');
      }
    } catch (err: any) {
      console.error('S3 upload error:', err);
      const message =
        err.response?.data?.message || err.message || 'Gagal mengunggah file ke S3 storage.';
      setUploadError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setManualUrl('');
      setShowManualInput(false);
      setUploadError(null);
    }
  };

  const hasValidValue = Boolean(
    value &&
      typeof value === 'string' &&
      value.trim() !== '' &&
      value.trim() !== '/' &&
      value.trim() !== 'null' &&
      value.trim() !== 'undefined'
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-stone-800">
          {label}
        </label>
      )}

      {hasValidValue && value ? (
        <div className="relative w-full max-w-sm h-48 rounded-[4px] border border-stone-200 overflow-hidden bg-stone-100 group">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="px-3 py-1.5 rounded-[4px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-md transition-colors"
              >
                Hapus Foto
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`w-full max-w-sm p-6 border-2 border-dashed rounded-[4px] text-center cursor-pointer transition-colors space-y-2 group ${
              isDragging
                ? 'border-[#0B3D26] bg-[#1F6B3F]/5'
                : 'border-stone-300 hover:border-[#1F6B3F] bg-[#FAF8F5]'
            }`}
          >
            {isUploading ? (
              <div className="py-4 space-y-2">
                <div className="w-8 h-8 border-2 border-[#0B3D26] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-medium text-stone-700">Mengunggah ke S3 storage...</p>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-[4px] bg-[#1F6B3F]/10 text-[#0B3D26] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-900">
                    Klik atau seret foto ke sini untuk unggah ke S3
                  </p>
                  <p className="text-[11px] text-[#7C8574] mt-0.5">
                    PNG, JPG, WebP maksimal {maxSizeMB}MB
                  </p>
                </div>
              </>
            )}
          </div>

          {uploadError && (
            <p className="text-xs text-rose-600 mt-1 font-medium">{uploadError}</p>
          )}

          {/* Alternative direct URL toggle */}
          <div className="mt-2">
            {!showManualInput ? (
              <button
                type="button"
                onClick={() => setShowManualInput(true)}
                className="text-[11px] text-[#1F6B3F] hover:underline"
              >
                Atau masukkan URL gambar langsung
              </button>
            ) : (
              <form onSubmit={handleManualSubmit} className="flex gap-2 mt-2 max-w-sm">
                <input
                  type="url"
                  placeholder="https://..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1 border border-stone-300 rounded-[4px] bg-white focus:outline-none focus:border-[#0B3D26]"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-[4px] bg-[#0B3D26] text-white text-xs font-medium hover:bg-[#1F6B3F]"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="px-2 py-1 text-xs text-stone-500 hover:text-stone-700"
                >
                  Batal
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
