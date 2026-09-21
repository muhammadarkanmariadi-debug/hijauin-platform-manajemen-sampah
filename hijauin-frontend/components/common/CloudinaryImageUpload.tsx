'use client';

import S3ImageUpload from './S3ImageUpload';

interface CloudinaryImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  preset?: string;
  folder?: string;
}

/**
 * Backward compatibility wrapper forwarding uploads to S3ImageUpload.
 */
export default function CloudinaryImageUpload({
  value,
  onChange,
  onRemove,
  label = 'Unggah Foto Bukti / Dokumen',
  folder = 'hijauin',
}: CloudinaryImageUploadProps) {
  return (
    <S3ImageUpload
      value={value}
      onChange={onChange}
      onRemove={onRemove}
      label={label}
      folder={folder}
    />
  );
}
