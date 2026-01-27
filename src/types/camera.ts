export interface CapturedPhoto {
  id: string;
  file: File;
  previewUrl: string;
  source: 'camera' | 'upload';
  capturedAt: string;
}

export interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCapture: (photo: CapturedPhoto) => void;
}