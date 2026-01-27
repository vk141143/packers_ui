import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useStatusPopup } from '../common/StatusPopupManager';

interface DraftBooking {
  sessionId: string;
}

interface SubmittedStepProps {
  draftBooking: DraftBooking;
}

export const SubmittedStep: React.FC<SubmittedStepProps> = ({ draftBooking }) => {
  const { showStatus, StatusPopup } = useStatusPopup();
  
  useEffect(() => {
    showStatus('booking-submitted');
  }, [showStatus]);

  return (
    <>
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
        <CheckCircle size={64} className="mx-auto mb-6 text-green-500" />
        <h2 className="text-2xl font-bold mb-4">Booking Submitted Successfully!</h2>
        <p className="text-gray-300 mb-6">
          Your booking request has been received. We'll contact you within 24 hours with a detailed quote.
        </p>
        <p className="text-sm text-gray-400">
          Reference ID: {draftBooking.sessionId}
        </p>
      </div>
      <StatusPopup />
    </>
  );
};