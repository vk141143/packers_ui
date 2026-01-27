import React from 'react';

interface DraftBooking {
  photos: any[];
}

interface PhotoStepProps {
  draftBooking: DraftBooking;
  updateDraftBooking: (updates: Partial<DraftBooking>) => void;
  onNext: () => void;
}

export const PhotoStep: React.FC<PhotoStepProps> = ({ draftBooking, updateDraftBooking, onNext }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Photo Upload</h2>
      <p className="text-gray-900 mb-4">Upload photos to help us provide an accurate quote</p>
      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
        <p className="text-gray-400">Photo upload functionality coming soon</p>
      </div>
    </div>
  );
};