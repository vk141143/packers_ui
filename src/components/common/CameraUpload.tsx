import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, Upload } from 'lucide-react';

interface CameraUploadProps {
  onPhotoCapture: (photoDataUrl: string) => void;
  onClose: () => void;
  isOpen: boolean;
  type: 'before' | 'after';
}

export const CameraUpload: React.FC<CameraUploadProps> = ({
  onPhotoCapture,
  onClose,
  isOpen,
  type
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      cleanup();
    }
    return cleanup;
  }, [isOpen]);

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraReady(false);
    setError(null);
    setCapturedPhoto(null);
  };

  const startCamera = async () => {
    try {
      setError(null);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setCameraReady(true);
          }).catch((playError) => {
            console.error('Error playing video:', playError);
            setError('Failed to start camera preview');
          });
        };
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      let errorMessage = 'Camera not available. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.';
      } else {
        errorMessage += 'Use file upload instead.';
      }
      
      setError(errorMessage);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && cameraReady) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Check if video is ready and has dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setError('Camera not ready. Please wait a moment and try again.');
        return;
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw the video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL with good quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(dataUrl);
      } else {
        setError('Failed to capture photo. Please try again.');
      }
    } else {
      setError('Camera not ready. Please wait and try again.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onPhotoCapture(dataUrl);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPhoto = () => {
    if (capturedPhoto) {
      onPhotoCapture(capturedPhoto);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 bg-black text-white">
        <h3 className="text-lg font-semibold">Take {type} Photo</h3>
        <button onClick={onClose} className="text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 relative bg-black">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white p-6">
              <Camera size={48} className="mx-auto mb-4 text-red-400" />
              <p className="text-lg font-semibold mb-2">Camera Not Available</p>
              <p className="text-sm mb-6">{error}</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 mx-auto"
              >
                <Upload size={20} />
                Upload Photo Instead
              </button>
            </div>
          </div>
        ) : !cameraReady ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-semibold">Starting Camera...</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <button
                onClick={() => {
                  setError(null);
                  startCamera();
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all"
              >
                Try Camera Again
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-all flex items-center gap-2 mx-auto"
              >
                <Upload size={16} />
                Upload File Instead
              </button>
            </div>
          </div>
        ) : !capturedPhoto ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
              <button
                onClick={capturePhoto}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-300 hover:border-blue-500 transition-all active:scale-95"
              >
                <Camera size={36} className="text-gray-800" />
              </button>
            </div>
          </>
        ) : (
          <>
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
              <button
                onClick={() => setCapturedPhoto(null)}
                className="px-8 py-4 bg-red-600 text-white rounded-xl flex items-center font-semibold shadow-2xl hover:bg-red-700 transition-all active:scale-95"
              >
                <X size={20} className="mr-2" />
                Retake
              </button>
              <button
                onClick={confirmPhoto}
                className="px-8 py-4 bg-green-600 text-white rounded-xl flex items-center font-semibold shadow-2xl hover:bg-green-700 transition-all active:scale-95"
              >
                <Check size={20} className="mr-2" />
                Use Photo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};