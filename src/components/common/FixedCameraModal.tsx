import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Upload } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCapture: (file: File) => void;
}

export const FixedCameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onPhotoCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    }
    return cleanup;
  }, [isOpen]);

  const startCamera = async () => {
    try {
      // PART 3: Secure context check
      if (!window.isSecureContext && location.hostname !== "localhost") {
        throw new Error("Camera requires HTTPS");
      }

      setError(null);
      setCameraReady(false);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 }
      });

      // PART 2: Stream validation
      console.log('Stream received:', mediaStream);
      
      if (!mediaStream.active || mediaStream.getTracks().length === 0) {
        throw new Error("No active camera tracks");
      }

      setStream(mediaStream);

      if (videoRef.current) {
        const video = videoRef.current;
        
        // PART 1: Mandatory video play fix
        video.srcObject = mediaStream;
        video.muted = true;
        video.playsInline = true;
        
        await video.play();
        setCameraReady(true);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setError(err.message || 'Camera not available');
      
      // PART 5: Fallback
      setTimeout(() => fileInputRef.current?.click(), 500);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onPhotoCapture(file);
        handleClose();
      }
    }, 'image/jpeg', 0.8);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoCapture(file);
      handleClose();
    }
  };

  const cleanup = () => {
    // PART 4: Clean shutdown
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
    setError(null);
  };

  const handleClose = () => {
    cleanup();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 text-white">
        <h3 className="text-lg font-semibold">Take Photo</h3>
        <button onClick={handleClose}>
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 relative">
        {error ? (
          <div className="flex items-center justify-center h-full text-white text-center p-6">
            <div>
              <Camera size={48} className="mx-auto mb-4 text-red-400" />
              <p className="mb-4">{error}</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-blue-600 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Upload size={20} />
                Upload Photo
              </button>
            </div>
          </div>
        ) : !cameraReady ? (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Starting Camera...</p>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <button
                onClick={capturePhoto}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl"
              >
                <Camera size={36} className="text-gray-800" />
              </button>
            </div>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};