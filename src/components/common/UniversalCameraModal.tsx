import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCcw, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCameraSupport } from '../../hooks/useCameraSupport';
import { CameraModalProps, CapturedPhoto } from '../../types/camera';

export const UniversalCameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onPhotoCapture
}) => {
  const { cameraSupported, isMobile, isIOS } = useCameraSupport();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (isOpen && cameraSupported) {
      startCamera();
    }
    return cleanup;
  }, [isOpen, cameraSupported]);

  const cleanup = () => {
    // PART 6: Clean shutdown
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraReady(false);
    setError(null);
    setCapturedImage(null);
    setPermissionDenied(false);
  };

  const startCamera = async () => {
    try {
      // PART 1: Secure context validation
      if (!window.isSecureContext && location.hostname !== "localhost") {
        setError("Camera only works on HTTPS or localhost");
        return;
      }

      setError(null);
      setPermissionDenied(false);
      
      console.log("Requesting camera permission...");
      
      const constraints = {
        video: {
          facingMode: isMobile ? 'environment' : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera permission granted");
      console.log("Stream received:", mediaStream);
      
      // PART 2: Stream validation
      if (!mediaStream.active || mediaStream.getTracks().length === 0) {
        throw new Error("No active camera tracks");
      }

      setStream(mediaStream);
      
      if (videoRef.current) {
        // PART 3: Video element fix for Edge
        const video = videoRef.current;
        video.srcObject = mediaStream;
        video.muted = true;
        video.playsInline = true;
        
        // CRITICAL: Must await play() for Edge compatibility
        await video.play();
        setCameraReady(true);
      }
      
      // PART 4: Timeout safety
      setTimeout(() => {
        if (!cameraReady) {
          setError("Camera could not start. Please try upload instead.");
        }
      }, 5000);
      
      // PART 5: Stream activity check
      setTimeout(() => {
        if (mediaStream && !mediaStream.active) {
          setError("Camera stream inactive. Using file upload.");
        }
      }, 2000);
      
    } catch (err: any) {
      console.error('Camera error:', err);
      
      if (err.name === 'NotAllowedError') {
        setPermissionDenied(true);
        setError('Camera access denied. Please allow camera permission and try again.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another application.');
      } else {
        setError('Camera not available. Please use file upload instead.');
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError('Camera not ready. Please wait and try again.');
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const previewUrl = URL.createObjectURL(blob);
      
      setCapturedImage(previewUrl);
    }, 'image/jpeg', 0.8);
  };

  const confirmCapture = () => {
    if (!capturedImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const photo: CapturedPhoto = {
        id: Date.now().toString(),
        file,
        previewUrl: capturedImage,
        source: 'camera',
        capturedAt: new Date().toISOString()
      };
      
      onPhotoCapture(photo);
      handleClose();
    }, 'image/jpeg', 0.8);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }
    
    const previewUrl = URL.createObjectURL(file);
    const photo: CapturedPhoto = {
      id: Date.now().toString(),
      file,
      previewUrl,
      source: 'upload',
      capturedAt: new Date().toISOString()
    };
    
    onPhotoCapture(photo);
    handleClose();
  };

  const handleClose = () => {
    cleanup();
    onClose();
  };

  const retakePhoto = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
      setCapturedImage(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-black text-white">
          <h3 className="text-lg font-semibold">Take Photo</h3>
          <button onClick={handleClose} className="text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-black">
          {!cameraSupported || error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white p-6 max-w-sm">
                <Camera size={48} className="mx-auto mb-4 text-red-400" />
                <p className="text-lg font-semibold mb-2">Camera Not Available</p>
                <p className="text-sm mb-6">{error || 'Camera not supported on this device'}</p>
                
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
                
                {permissionDenied && (
                  <button
                    onClick={startCamera}
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all"
                  >
                    Try Camera Again
                  </button>
                )}
              </div>
            </div>
          ) : !cameraReady ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-semibold mb-2">Starting Camera...</p>
                <p className="text-sm text-gray-300">Allow camera access to take photo</p>
              </div>
            </div>
          ) : capturedImage ? (
            <>
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={retakePhoto}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl flex items-center font-semibold shadow-2xl hover:bg-red-700 transition-all"
                >
                  <RotateCcw size={20} className="mr-2" />
                  Retake
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmCapture}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl flex items-center font-semibold shadow-2xl hover:bg-green-700 transition-all"
                >
                  <Camera size={20} className="mr-2" />
                  Use Photo
                </motion.button>
              </div>
            </>
          ) : (
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
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={capturePhoto}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-300 hover:border-blue-500 transition-all"
                >
                  <Camera size={36} className="text-gray-800" />
                </motion.button>
              </div>
              
              {/* File upload fallback button */}
              <div className="absolute top-4 right-4 z-10">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
                >
                  <Upload size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};