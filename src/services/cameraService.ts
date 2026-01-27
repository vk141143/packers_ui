import { detectDevice, checkSecureContext, checkCameraPermission } from '../utils/deviceDetection';

import { CapturedPhoto } from '../types/camera';

export interface CameraPhoto extends CapturedPhoto {
  device: 'mobile' | 'desktop';
}

export class CameraService {
  private stream: MediaStream | null = null;
  private device = detectDevice();

  async startCamera(): Promise<MediaStream> {
    const { isSecure, error } = checkSecureContext();
    if (!isSecure) throw new Error(error);

    if (!this.device.hasCamera) {
      throw new Error('No camera available on this device');
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: this.device.isMobile ? { ideal: 'environment' } : 'user',
          width: { ideal: this.device.isMobile ? 1280 : 1920 },
          height: { ideal: this.device.isMobile ? 720 : 1080 }
        },
        audio: false
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.stream;
    } catch (error: any) {
      throw this.handleCameraError(error);
    }
  }

  async capturePhoto(video: HTMLVideoElement, canvas: HTMLCanvasElement): Promise<CameraPhoto> {
    return new Promise((resolve, reject) => {
      if (video.readyState !== 4) {
        reject(new Error('Video not ready'));
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Draw and flip if mobile front camera
      if (this.device.isMobile) {
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create image'));
          return;
        }

        const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const photo: CameraPhoto = {
          id: Date.now().toString(),
          file,
          previewUrl: URL.createObjectURL(blob),
          source: 'camera',
          device: this.device.isMobile ? 'mobile' : 'desktop',
          capturedAt: new Date().toISOString()
        };

        resolve(photo);
      }, 'image/jpeg', 0.8);
    });
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  async checkPermissions(): Promise<{ granted: boolean; error?: string }> {
    return await checkCameraPermission();
  }

  shouldUseFallback(): boolean {
    return this.device.isIOS || !this.device.hasCamera;
  }

  private handleCameraError(error: any): Error {
    switch (error.name) {
      case 'NotAllowedError':
        return new Error('Permission denied. Please allow camera access.');
      case 'NotFoundError':
        return new Error('No camera found on this device.');
      case 'NotReadableError':
        return new Error('Camera is being used by another app.');
      default:
        return new Error('Unable to access camera. Please allow permission or upload a photo.');
    }
  }
}