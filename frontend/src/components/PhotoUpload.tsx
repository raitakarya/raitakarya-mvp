import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';

interface PhotoUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  currentPhoto?: string;
  type?: 'profile' | 'job';
  showReasons?: boolean;
}

export default function PhotoUpload({
  onUploadSuccess,
  onUploadError,
  currentPhoto,
  type = 'profile',
  showReasons = true
}: PhotoUploadProps) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t('photo.invalidFileType'));
      if (onUploadError) onUploadError(t('photo.invalidFileType'));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('photo.fileTooLarge'));
      if (onUploadError) onUploadError(t('photo.fileTooLarge'));
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    await uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      // Compress image if needed (client-side)
      const compressedFile = await compressImage(file);

      // Create form data
      const formData = new FormData();
      formData.append('photo', compressedFile);

      // Upload to backend
      const endpoint = type === 'profile' ? '/upload/profile-photo' : '/upload/job-photo';
      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        onUploadSuccess(response.data.url);
        setError(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || t('photo.uploadFailed');
      setError(errorMessage);
      if (onUploadError) onUploadError(errorMessage);
      setPreview(currentPhoto || null);
    } finally {
      setIsUploading(false);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          // Calculate new dimensions (max 800x800)
          let width = img.width;
          let height = img.height;
          const maxDim = 800;

          if (width > height && width > maxDim) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else if (height > maxDim) {
            width = (width / height) * maxDim;
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.85
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        {/* Photo Preview */}
        <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 border-4 border-primary-200 mb-4">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isUploading}
            className="btn btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {isUploading ? t('common.uploading') : t('photo.takePhoto')}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="btn btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {t('photo.uploadPhoto')}
          </button>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Upload progress */}
        {isUploading && (
          <div className="mt-4 flex items-center gap-2 text-primary-600">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{t('common.uploading')}</span>
          </div>
        )}
      </div>

      {/* Reasons to upload (for profile photos) */}
      {showReasons && type === 'profile' && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <h4 className="font-semibold text-primary-800 mb-2">{t('photo.whyPhoto')}</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">✓</span>
              <span>{t('photo.photoReason1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">✓</span>
              <span>{t('photo.photoReason2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 mt-0.5">✓</span>
              <span>{t('photo.photoReason3')}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
