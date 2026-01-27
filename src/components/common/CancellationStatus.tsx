import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, Shield, DollarSign } from 'lucide-react';
import { Job } from '../../types';

interface CancellationStatusProps {
  job: Job;
  userRole: 'client' | 'admin' | 'crew' | 'sales' | 'management';
  showDetails?: boolean;
  compact?: boolean;
}

const CANCELLATION_RULES = {
  'client-booking-request': { 
    allowed: true, 
    refundPercent: 100, 
    reason: 'Full refund available',
    color: 'green',
    icon: CheckCircle
  },
  'admin-quoted': { 
    allowed: true, 
    refundPercent: 100, 
    reason: 'Full refund available',
    color: 'green',
    icon: CheckCircle
  },
  'client-approved': { 
    allowed: true, 
    refundPercent: 100, 
    reason: 'Full refund available',
    color: 'green',
    icon: CheckCircle
  },
  'payment-pending': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Cannot cancel during payment',
    color: 'red',
    icon: XCircle
  },
  'booking-confirmed': { 
    allowed: true, 
    refundPercent: 85, 
    reason: '15% admin fee applies',
    color: 'orange',
    icon: AlertTriangle
  },
  'crew-assigned': { 
    allowed: true, 
    refundPercent: 75, 
    reason: '25% cancellation fee',
    color: 'orange',
    icon: AlertTriangle
  },
  'crew-dispatched': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Crew en route - Cannot cancel',
    color: 'red',
    icon: XCircle
  },
  'in-progress': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Work in progress',
    color: 'red',
    icon: XCircle
  },
  'work-completed': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Work completed',
    color: 'red',
    icon: XCircle
  },
  'completed': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Job completed',
    color: 'red',
    icon: XCircle
  },
  'cancelled': { 
    allowed: false, 
    refundPercent: 0, 
    reason: 'Already cancelled',
    color: 'gray',
    icon: Shield
  }
};

export const CancellationStatus: React.FC<CancellationStatusProps> = ({
  job,
  userRole,
  showDetails = true,
  compact = false
}) => {
  const rule = CANCELLATION_RULES[job.status as keyof typeof CANCELLATION_RULES] || 
               { allowed: false, refundPercent: 0, reason: 'Status unknown', color: 'gray', icon: Shield };

  const canUserCancel = () => {
    if (!rule.allowed) return false;
    
    switch (userRole) {
      case 'client':
        return ['client-booking-request', 'admin-quoted', 'client-approved', 'booking-confirmed', 'crew-assigned'].includes(job.status);
      case 'admin':
        return ['client-booking-request', 'admin-quoted', 'client-approved', 'booking-confirmed', 'crew-assigned'].includes(job.status);
      case 'crew':
        return false;
      case 'sales':
        return ['client-booking-request', 'admin-quoted'].includes(job.status);
      case 'management':
        return ['client-booking-request', 'admin-quoted', 'client-approved', 'booking-confirmed', 'crew-assigned'].includes(job.status);
      default:
        return false;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          icon: 'text-orange-600'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600'
        };
      case 'gray':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600'
        };
    }
  };

  const colors = getColorClasses(rule.color);
  const Icon = rule.icon;
  const depositAmount = job.finalQuote?.fixedPrice || job.estimatedValue || 0;
  const refundAmount = Math.round(depositAmount * (rule.refundPercent / 100));
  const actuallyCanCancel = canUserCancel();

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${colors.bg} ${colors.border}`}>
        <Icon className={`w-4 h-4 ${colors.icon}`} />
        <span className={`text-sm font-medium ${colors.text}`}>
          {actuallyCanCancel ? `${rule.refundPercent}% Refund` : 'Cannot Cancel'}
        </span>
      </div>
    );
  }

  if (job.status === 'cancelled') {
    return (
      <div className={`rounded-lg border p-4 ${colors.bg} ${colors.border}`}>
        <div className="flex items-center gap-3 mb-2">
          <Icon className={`w-5 h-5 ${colors.icon}`} />
          <h4 className={`font-semibold ${colors.text}`}>Booking Cancelled</h4>
        </div>
        {job.cancelledAt && (
          <p className={`text-sm ${colors.text} mb-2`}>
            Cancelled on {new Date(job.cancelledAt).toLocaleDateString()}
          </p>
        )}
        {job.cancellationReason && (
          <p className={`text-sm ${colors.text} mb-2`}>
            <strong>Reason:</strong> {job.cancellationReason}
          </p>
        )}
        {job.refundAmount && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Refund: £{job.refundAmount}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-4 ${colors.bg} ${colors.border}`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-5 h-5 ${colors.icon}`} />
        <h4 className={`font-semibold ${colors.text}`}>
          {actuallyCanCancel ? 'Cancellation Available' : 'Cannot Cancel'}
        </h4>
      </div>
      
      <p className={`text-sm ${colors.text} mb-3`}>
        {rule.reason}
      </p>

      {showDetails && actuallyCanCancel && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={colors.text}>Original Amount:</span>
            <span className={`font-semibold ${colors.text}`}>£{depositAmount}</span>
          </div>
          
          {rule.refundPercent < 100 && (
            <div className="flex items-center justify-between text-sm">
              <span className={colors.text}>Cancellation Fee:</span>
              <span className="font-semibold text-red-600">
                -£{depositAmount - refundAmount} ({100 - rule.refundPercent}%)
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm border-t pt-2">
            <span className={`font-semibold ${colors.text}`}>Refund Amount:</span>
            <span className="font-bold text-green-600">£{refundAmount}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-700">
              Refunds processed within 5-7 business days
            </span>
          </div>
        </div>
      )}

      {!actuallyCanCancel && userRole === 'crew' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>Note:</strong> Only admin can cancel bookings. Contact dispatch if cancellation is needed.
          </p>
        </div>
      )}
    </div>
  );
};