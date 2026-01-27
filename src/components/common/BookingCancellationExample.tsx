import React from 'react';
import { DepositCancellationModal } from '../components/common/DepositCancellationModal';
import { useCancellationFlow } from '../hooks/useCancellationFlow';

interface BookingCancellationExampleProps {
  booking: {
    id: string;
    referenceNumber: string;
    depositAmount: number;
    serviceType: string;
    scheduledDate: string;
    clientName: string;
    status: string;
  };
}

export const BookingCancellationExample: React.FC<BookingCancellationExampleProps> = ({ booking }) => {
  const {
    isProcessing,
    isModalOpen,
    openCancellationModal,
    closeCancellationModal,
    processCancellation
  } = useCancellationFlow({
    bookingId: booking.id,
    depositAmount: booking.depositAmount,
    onSuccess: (data) => {
      // Handle successful cancellation
      alert(`✅ Booking Cancelled Successfully!
      
📋 Reference: #${booking.referenceNumber}
💰 Refund Amount: £${data.refundAmount.toFixed(2)}
📧 Confirmation email sent
⏱️ Refund processing: 5-7 business days

Thank you for using our service.`);
      
      // You could also redirect or update the booking list here
      // window.location.reload(); // or update state
    },
    onError: (error) => {
      // Handle cancellation error
      alert(`❌ Cancellation Failed: ${error}`);
    }
  });

  // Check if booking can be cancelled (has deposit paid)
  const canCancel = booking.depositAmount > 0 && 
                   !['cancelled', 'completed', 'refunded'].includes(booking.status);

  if (!canCancel) {
    return (
      <button
        disabled
        className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
      >
        Cannot Cancel
      </button>
    );
  }

  return (
    <>
      <button
        onClick={openCancellationModal}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
      >
        Cancel Booking
      </button>

      <DepositCancellationModal
        booking={booking}
        isOpen={isModalOpen}
        onClose={closeCancellationModal}
        onCancelConfirm={processCancellation}
        isProcessing={isProcessing}
      />
    </>
  );
};