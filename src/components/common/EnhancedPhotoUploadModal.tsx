import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X } from 'lucide-react';
import { UniversalCameraModal } from './UniversalCameraModal';
import { useCameraSupport } from '../../hooks/useCameraSupport';
import { CapturedPhoto } from '../../types/camera';

interface EnhancedPhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotosAdded: (photos: CapturedPhoto[]) => void;
  maxPhotos?: number;
}

export const EnhancedPhotoUploadModal: React.FC<EnhancedPhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onPhotosAdded,
  maxPhotos = 10
}) => {
  const { cameraSupported } = useCameraSupport();
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraPhoto = (photo: CapturedPhoto) => {
    onPhotosAdded([photo]);
    setShowCamera(false);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max 5MB per photo.`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const photos: CapturedPhoto[] = validFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      source: 'upload',
      capturedAt: new Date().toISOString()
    }));

    onPhotosAdded(photos);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Add Photos</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            Take photos or upload from your device. Max {maxPhotos} photos, 5MB each.
          </p>

          <div className="space-y-3">
            {cameraSupported && (
              <button
                onClick={() => setShowCamera(true)}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Camera size={20} />
                📷 Take Photo
              </button>
            )}
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Upload size={20} />
              📁 Upload from Device
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </motion.div>
      </div>
      
      <UniversalCameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onPhotoCapture={handleCameraPhoto}
      />
    </>
  );
};