import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { CameraUpload } from './CameraUpload';

interface FlexiblePhotoUploadProps {
  onPhotoCapture: (photoDataUrl: string) => void;
  userRole: 'client' | 'crew' | 'admin';
  type: 'before' | 'after';
  buttonText?: string;
}

export const FlexiblePhotoUpload: React.FC<FlexiblePhotoUploadProps> = ({
  onPhotoCapture,
  userRole,
  type,
  buttonText = 'Add Photo'
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onPhotoCapture(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Crew can use camera OR upload file (same as client)
  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setShowCamera(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          <Camera size={16} className="mr-2" />
          Camera
        </button>
        
        <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all">
          <Upload size={16} className="mr-2" />
          Upload
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <CameraUpload
        isOpen={showCamera}
        type={type}
        onPhotoCapture={onPhotoCapture}
        onClose={() => setShowCamera(false)}
      />
    </>
  );
};