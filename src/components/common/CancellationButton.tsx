import React from 'react';
import { XCircle, AlertTriangle, Shield } from 'lucide-react';
import { Job } from '../../types';

interface CancellationButtonProps {
  job: Job;
  userRole: 'client' | 'admin' | 'crew' | 'sales' | 'management';
  onCancel: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const CANCELLATION_RULES = {
  'client-booking-request': { allowed: true, reason: 'Can cancel before quote' },
  'admin-quoted': { allowed: true, reason: 'Can cancel before approval' },
  'client-approved': { allowed: true, reason: 'Can cancel before payment' },
  'payment-pending': { allowed: false, reason: 'Cannot cancel during payment' },
  'booking-confirmed': { allowed: true, reason: 'Cancellation fee applies' },
  'crew-assigned': { allowed: true, reason: 'Cancellation fee applies' },
  'crew-dispatched': { allowed: false, reason: 'Crew en route' },
  'in-progress': { allowed: false, reason: 'Work in progress' },
  'work-completed': { allowed: false, reason: 'Work completed' },
  'completed': { allowed: false, reason: 'Job completed' },
  'cancelled': { allowed: false, reason: 'Already cancelled' }
};

export const CancellationButton: React.FC<CancellationButtonProps> = ({
  job,
  userRole,
  onCancel,
  variant = 'danger',
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const rule = CANCELLATION_RULES[job.status as keyof typeof CANCELLATION_RULES] || 
               { allowed: false, reason: 'Status not recognized' };

  const canUserCancel = () => {
    if (!rule.allowed) return false;
    
    switch (userRole) {
      case 'client':
        return ['client-booking-request', 'admin-quoted', 'client-approved', 'booking-confirmed', 'crew-assigned'].includes(job.status);
      case 'admin':
        return ['client-booking-request', 'admin-quoted', 'client-approved', 'booking-confirmed', 'crew-assigned'].includes(job.status);
      case 'crew':
        return false; // Crew cannot cancel bookings
      case 'sales':
        return ['client-booking-request', 'admin-quoted'].includes(job.status);
      case 'management':
        return ['client-booking-request', 'admin-quoted', 'client-approved', 'booking-confirmed', 'crew-assigned'].includes(job.status);
      default:
        return false;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-red-600 text-white hover:bg-red-700 border-red-600';
      case 'secondary':
        return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 border-red-600';
      case 'minimal':
        return 'bg-transparent text-red-600 hover:bg-red-50 border-red-300';
      default:
        return 'bg-red-600 text-white hover:bg-red-700 border-red-600';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;
    
    if (!canUserCancel()) {
      return <Shield className="w-4 h-4" />;
    }
    
    if (['booking-confirmed', 'crew-assigned'].includes(job.status)) {
      return <AlertTriangle className="w-4 h-4" />;
    }
    
    return <XCircle className="w-4 h-4" />;
  };

  const getButtonText = () => {
    if (!canUserCancel()) {
      return 'Cannot Cancel';
    }
    
    if (['booking-confirmed', 'crew-assigned'].includes(job.status)) {
      return 'Cancel (Fee Applies)';
    }
    
    return 'Cancel Booking';
  };

  const getTooltipText = () => {
    if (!canUserCancel()) {
      return rule.reason;
    }
    
    if (['booking-confirmed', 'crew-assigned'].includes(job.status)) {
      return 'Cancellation fee will be deducted from refund';
    }
    
    return 'Cancel this booking';
  };

  if (!canUserCancel()) {
    return (
      <div className="relative group">
        <button
          disabled
          className={`
            inline-flex items-center gap-2 font-semibold rounded-lg border transition-all
            cursor-not-allowed opacity-50
            bg-gray-100 text-gray-500 border-gray-300
            ${getSizeStyles()}
            ${className}
          `}
          title={getTooltipText()}
        >
          {getIcon()}
          {getButtonText()}
        </button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          {getTooltipText()}
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={onCancel}
        className={`
          inline-flex items-center gap-2 font-semibold rounded-lg border transition-all
          hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          ${getVariantStyles()}
          ${getSizeStyles()}
          ${className}
        `}
        title={getTooltipText()}
      >
        {getIcon()}
        {getButtonText()}
      </button>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
        {getTooltipText()}
      </div>
    </div>
  );
};