import { useState, useEffect } from 'react';

interface CameraSupport {
  cameraSupported: boolean;
  isMobile: boolean;
  isIOS: boolean;
}

export const useCameraSupport = (): CameraSupport => {
  const [cameraSupported, setCameraSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const userAgent = navigator.userAgent.toLowerCase();
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const ios = /iphone|ipad|ipod/i.test(userAgent);
    
    setIsMobile(mobile);
    setIsIOS(ios);

    // Check camera support
    const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    setCameraSupported(hasMediaDevices);
  }, []);

  return { cameraSupported, isMobile, isIOS };
};