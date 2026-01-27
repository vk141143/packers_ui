import { useState } from 'react';

interface CancellationData {
  reason: string;
  refundAmount: number;
  processingFee?: number;
}

interface UseCancellationFlowProps {
  bookingId: string;
  depositAmount: number;
  onSuccess?: (data: CancellationData) => void;
  onError?: (error: string) => void;
}

export const useCancellationFlow = ({
  bookingId,
  depositAmount,
  onSuccess,
  onError
}: UseCancellationFlowProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateRefund = (depositAmount: number): { refundAmount: number; processingFee: number } => {
    // Example refund calculation logic
    const processingFee = Math.min(depositAmount * 0.05, 25); // 5% fee, max £25
    const refundAmount = Math.max(depositAmount - processingFee, 0);
    
    return { refundAmount, processingFee };
  };

  const processCancellation = async (reason: string): Promise<void> => {
    setIsProcessing(true);
    
    try {
      const { refundAmount, processingFee } = calculateRefund(depositAmount);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would make the actual API call to cancel the booking
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          reason,
          refundAmount,
          processingFee
        })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      const result = await response.json();
      
      // Success callback
      onSuccess?.({
        reason,
        refundAmount,
        processingFee
      });

      setIsModalOpen(false);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const openCancellationModal = () => {
    setIsModalOpen(true);
  };

  const closeCancellationModal = () => {
    if (!isProcessing) {
      setIsModalOpen(false);
    }
  };

  return {
    isProcessing,
    isModalOpen,
    openCancellationModal,
    closeCancellationModal,
    processCancellation,
    calculateRefund
  };
};