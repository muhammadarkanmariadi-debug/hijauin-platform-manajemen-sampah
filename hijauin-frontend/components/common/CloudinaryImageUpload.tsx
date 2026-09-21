'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

interface CloudinaryImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  preset?: string;
  folder?: string;
}

/**
 * Editorial Cloudinary Image Upload Component.
 *
 * Conforms to docs/DESIGN.md:
 * - 4px radius, subtle hairlines
 * - Forest-950 and bone-100 color accents
 * - Uses next-cloudinary's CldUploadWidget with automatic fallback
 */
export default function CloudinaryImageUpload({
  value,
  onChange,
  onRemove,
  label = 'Unggah Foto Bukti / Dokumen',
  preset,
  folder = 'hijauin',
}: CloudinaryImageUploadProps) {
  const [manualUrl, setManualUrl] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = preset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'hijauin_preset';

  const handleSuccess = (results: { info?: string | { secure_url?: string } }) => {
    if (typeof results?.info === 'object' && results.info?.secure_url) {
      onChange(results.info.secure_url);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setManualUrl('');
      setShowManualInput(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-stone-800">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative w-full max-w-sm h-48 rounded-[4px] border border-stone-200 overflow-hidden bg-stone-100 group">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
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
          {cloudName ? (
            <CldUploadWidget
              uploadPreset={uploadPreset}
              options={{
                folder,
                maxFiles: 1,
                resourceType: 'image',
                clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                maxFileSize: 5000000, // 5MB
              }}
              onSuccess={handleSuccess}
            >
              {({ open }) => (
                <div
                  onClick={() => open?.()}
                  className="w-full max-w-sm p-6 border-2 border-dashed border-stone-300 hover:border-[#1F6B3F] bg-[#FAF8F5] rounded-[4px] text-center cursor-pointer transition-colors space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-[4px] bg-[#1F6B3F]/10 text-[#0B3D26] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-900">
                      Klik untuk unggah lewat Cloudinary
                    </p>
                    <p className="text-[11px] text-[#7C8574] mt-0.5">
                      PNG, JPG, WebP maksimal 5MB
                    </p>
                  </div>
                </div>
              )}
            </CldUploadWidget>
          ) : (
            <div className="w-full max-w-sm p-5 border border-dashed border-stone-300 rounded-[4px] bg-[#FAF8F5] space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#7C8574]">
                <svg className="w-4 h-4 text-[#1F6B3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Input tautan gambar langsung:</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 border border-stone-300 rounded-[4px] focus:outline-none focus:border-[#0B3D26] bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (manualUrl) {
                      onChange(manualUrl.trim());
                      setManualUrl('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-[4px] bg-[#0B3D26] text-white text-xs font-semibold hover:bg-[#1F6B3F] transition-colors"
                >
                  Set Foto
                </button>
              </div>
            </div>
          )}

          {/* Alternative direct URL toggle when Cloudinary widget is present */}
          {cloudName && (
            <div className="mt-1">
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
                    className="flex-1 text-xs px-2.5 py-1 border border-stone-300 rounded-[4px] bg-white"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded-[4px] bg-[#0B3D26] text-white text-xs font-medium"
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
          )}
        </div>
      )}
    </div>
  );
}
