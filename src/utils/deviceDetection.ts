// Device & Browser Detection Utility
export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  browser: string;
  hasCamera: boolean;
  supportsFileCapture: boolean;
}

export const detectDevice = (): DeviceInfo => {
  const ua = navigator.userAgent.toLowerCase();
  
  const isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);
  const isMobile = isIOS || isAndroid || /mobile|webos|blackberry|iemobile|opera mini/.test(ua);
  const isDesktop = !isMobile;
  
  let browser = 'unknown';
  if (ua.includes('chrome')) browser = 'chrome';
  else if (ua.includes('safari')) browser = 'safari';
  else if (ua.includes('firefox')) browser = 'firefox';
  else if (ua.includes('edge')) browser = 'edge';
  
  const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const supportsFileCapture = 'capture' in document.createElement('input');
  
  return { isIOS, isAndroid, isMobile, isDesktop, browser, hasCamera, supportsFileCapture };
};

// Security & Context Checks
export const checkSecureContext = (): { isSecure: boolean; error?: string } => {
  if (!window.isSecureContext) {
    return { isSecure: false, error: 'Camera requires HTTPS connection' };
  }
  
  if (!navigator.mediaDevices?.getUserMedia) {
    return { isSecure: false, error: 'Camera API not supported' };
  }
  
  return { isSecure: true };
};

// Camera Permission Check
export const checkCameraPermission = async (): Promise<{ granted: boolean; error?: string }> => {
  try {
    const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
    return { granted: result.state === 'granted' };
  } catch {
    return { granted: false, error: 'Permission check failed' };
  }
};