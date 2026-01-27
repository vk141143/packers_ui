import { JobStatus } from '../types';

// Define valid status transitions
const VALID_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  'client-booking-request': ['admin-quoted', 'cancelled'],
  'admin-quoted': ['client-approved', 'quote-rejected', 'cancelled'],
  'quote-rejected': ['admin-quoted', 'cancelled'],
  'client-approved': ['payment-pending', 'cancelled'],
  'payment-pending': ['booking-confirmed', 'cancelled'],
  'booking-confirmed': ['crew-assigned', 'cancelled'],
  'crew-assigned': ['in-progress', 'cancelled'],
  'in-progress': ['work-completed', 'cancelled'],
  'work-completed': ['admin-verified', 'admin-rejected'],
  'admin-verified': ['final-payment-pending', 'completed'],
  'final-payment-pending': ['completed', 'cancelled'],
  'completed': ['refunded'], // Only allow refund after completion
  'admin-rejected': ['in-progress', 'cancelled'],
  'cancelled': [], // Terminal state
  'refunded': [], // Terminal state
  'admin-reviewed': ['admin-verified', 'admin-rejected'] // Legacy support
};

export interface StatusTransitionResult {
  allowed: boolean;
  reason?: string;
}

export const canTransitionTo = (
  currentStatus: JobStatus, 
  newStatus: JobStatus
): StatusTransitionResult => {
  // Allow same status (no change)
  if (currentStatus === newStatus) {
    return { allowed: true };
  }

  const allowedTransitions = VALID_TRANSITIONS[currentStatus];
  
  if (!allowedTransitions) {
    return { 
      allowed: false, 
      reason: `Unknown current status: ${currentStatus}` 
    };
  }

  if (!allowedTransitions.includes(newStatus)) {
    return { 
      allowed: false, 
      reason: `Cannot transition from ${currentStatus} to ${newStatus}. Valid transitions: ${allowedTransitions.join(', ')}` 
    };
  }

  return { allowed: true };
};

export const getValidNextStatuses = (currentStatus: JobStatus): JobStatus[] => {
  return VALID_TRANSITIONS[currentStatus] || [];
};

export const isTerminalStatus = (status: JobStatus): boolean => {
  return VALID_TRANSITIONS[status]?.length === 0;
};

// Status validation with business rules
export const validateStatusTransition = (
  currentStatus: JobStatus,
  newStatus: JobStatus,
  jobData?: any
): StatusTransitionResult => {
  // First check if transition is allowed
  const basicValidation = canTransitionTo(currentStatus, newStatus);
  if (!basicValidation.allowed) {
    return basicValidation;
  }

  // Additional business rule validations
  switch (newStatus) {
    case 'crew-assigned':
      if (!jobData?.crewIds?.length) {
        return { 
          allowed: false, 
          reason: 'Cannot assign crew without selecting crew members' 
        };
      }
      break;

    case 'in-progress':
      if (!jobData?.crewAssigned?.length) {
        return { 
          allowed: false, 
          reason: 'Cannot start work without assigned crew' 
        };
      }
      break;

    case 'work-completed':
      if (!jobData?.photos?.some((p: any) => p.type === 'after')) {
        return { 
          allowed: false, 
          reason: 'Cannot complete work without after photos' 
        };
      }
      break;

    case 'admin-verified':
      if (!jobData?.verifiedFinalPrice && jobData?.verifiedFinalPrice !== 0) {
        return { 
          allowed: false, 
          reason: 'Cannot verify job without setting final price' 
        };
      }
      break;

    case 'completed':
      if (jobData?.finalPrice > 0 && jobData?.paymentStatus !== 'success') {
        return { 
          allowed: false, 
          reason: 'Cannot complete job with pending payment' 
        };
      }
      break;
  }

  return { allowed: true };
};