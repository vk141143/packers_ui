import React, { useEffect, useState } from 'react';
import './StatusPopup.css';

export type StatusType = 
  | 'booking-submitted'
  | 'quote-generated'
  | 'quote-accepted'
  | 'payment-success'
  | 'crew-assigned'
  | 'job-started'
  | 'job-completed'
  | 'final-payment'
  | 'booking-cancelled'
  | 'no-refund-warning';

interface StatusConfig {
  title: string;
  message: string;
  duration: number;
}

const statusConfig: Record<StatusType, StatusConfig> = {
  'booking-submitted': {
    title: 'Booking Submitted!',
    message: 'Your request has been sent successfully',
    duration: 3000
  },
  'quote-generated': {
    title: 'Quote Ready!',
    message: 'Your custom quote has been generated',
    duration: 3000
  },
  'quote-accepted': {
    title: 'Deal Accepted!',
    message: 'Quote accepted. Please proceed with deposit',
    duration: 3000
  },
  'payment-success': {
    title: 'Payment Received!',
    message: 'Deposit payment successful! Your booking is confirmed.',
    duration: 4000
  },
  'crew-assigned': {
    title: 'Crew Assigned!',
    message: 'Your job has been assigned to our team',
    duration: 3000
  },
  'job-started': {
    title: 'Work Started!',
    message: 'Our crew has begun working on your job',
    duration: 3000
  },
  'job-completed': {
    title: 'Job Completed!',
    message: 'Work finished successfully. Awaiting verification',
    duration: 4000
  },
  'final-payment': {
    title: 'Payment Complete!',
    message: 'All payments received. Invoice generated',
    duration: 4000
  },
  'booking-cancelled': {
    title: 'Booking Cancelled',
    message: 'Your booking has been cancelled',
    duration: 3000
  },
  'no-refund-warning': {
    title: 'No Refund Available',
    message: 'Deposit amount cannot be refunded',
    duration: 4000
  }
};

interface StatusPopupManagerProps {
  statusType: StatusType | null;
  onClose?: () => void;
}

export const StatusPopupManager: React.FC<StatusPopupManagerProps> = ({ 
  statusType, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<StatusType | null>(null);

  useEffect(() => {
    if (statusType) {
      setCurrentStatus(statusType);
      setIsVisible(true);
      
      const config = statusConfig[statusType];
      const timer = setTimeout(() => {
        hideStatus();
      }, config.duration);

      return () => clearTimeout(timer);
    }
  }, [statusType]);

  const hideStatus = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentStatus(null);
      onClose?.();
    }, 300);
  };

  if (!currentStatus) return null;

  const config = statusConfig[currentStatus];

  return (
    <div 
      className={`popup-container ${!isVisible ? 'hidden' : ''} ${currentStatus}`}
      onClick={hideStatus}
    >
      <div className="popup-content">
        <h3 className="status-title">{config.title}</h3>
        <p className="status-message">{config.message}</p>
      </div>
    </div>
  );
};

// Hook for managing status popups
export const useStatusPopup = () => {
  const [currentStatus, setCurrentStatus] = useState<StatusType | null>(null);

  const showStatus = (status: StatusType) => {
    setCurrentStatus(status);
  };

  const hideStatus = () => {
    setCurrentStatus(null);
  };

  return {
    currentStatus,
    showStatus,
    hideStatus,
    StatusPopup: () => (
      <StatusPopupManager 
        statusType={currentStatus} 
        onClose={hideStatus} 
      />
    )
  };
};