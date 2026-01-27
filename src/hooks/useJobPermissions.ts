import { useMemo } from 'react';
import { BookingStatus } from '../types/booking';
import { UserRole } from '../types';

interface JobPermissions {
  canView: boolean;
  canEdit: boolean;
  canCancel: boolean;
  canPay: boolean;
  canAssignCrew: boolean;
  canStartWork: boolean;
  canCompleteWork: boolean;
  canReview: boolean;
  canApproveQuote: boolean;
  canGenerateQuote: boolean;
  canViewPricing: boolean;
  canRefund: boolean;
  showCancelButton: boolean;
  showPaymentButton: boolean;
  allowQuoteEdit: boolean;
}

const STATUS_PERMISSIONS: Record<BookingStatus, {
  allowedActions: string[];
  allowedRoles: Record<string, string[]>;
}> = {
  'quote-requested': {
    allowedActions: ['view', 'edit', 'cancel', 'generateQuote'],
    allowedRoles: {
      client: ['view', 'edit', 'cancel'],
      admin: ['view', 'edit', 'cancel', 'generateQuote'],
      crew: [],
      sales: ['view'],
      management: ['view']
    }
  },
  'quote-generated': {
    allowedActions: ['view', 'cancel', 'approveQuote'],
    allowedRoles: {
      client: ['view', 'cancel', 'approveQuote'],
      admin: ['view', 'edit', 'cancel'],
      crew: [],
      sales: ['view'],
      management: ['view']
    }
  },
  'pending-admin': {
    allowedActions: ['view', 'cancel', 'generateQuote'],
    allowedRoles: {
      client: ['view', 'cancel'],
      admin: ['view', 'generateQuote', 'cancel'],
      crew: [],
      sales: ['view'],
      management: ['view']
    }
  },
  'admin-quoted': {
    allowedActions: ['view', 'cancel', 'approveQuote', 'viewPricing'],
    allowedRoles: {
      client: ['view', 'cancel', 'approveQuote', 'viewPricing'],
      admin: ['view', 'cancel'],
      crew: [],
      sales: ['view'],
      management: ['view']
    }
  },
  'client-approved': {
    allowedActions: ['view', 'cancel', 'pay', 'viewPricing'],
    allowedRoles: {
      client: ['view', 'cancel', 'pay', 'viewPricing'],
      admin: ['view', 'cancel'],
      crew: [],
      sales: ['view'],
      management: ['view']
    }
  },
  'payment-pending': {
    allowedActions: ['view', 'cancel'],
    allowedRoles: {
      client: ['view', 'cancel'],
      admin: ['view', 'cancel'],
      crew: [],
      sales: ['view'],
      management: ['view']
    }
  },
  'booking-confirmed': {
    allowedActions: ['view', 'assignCrew', 'viewPricing'],
    allowedRoles: {
      client: ['view', 'viewPricing'],
      admin: ['view', 'assignCrew', 'viewPricing'],
      crew: [],
      sales: ['view'],
      management: ['view', 'viewPricing']
    }
  },
  'crew-assigned': {
    allowedActions: ['view', 'startWork', 'viewPricing'],
    allowedRoles: {
      client: ['view', 'viewPricing'],
      admin: ['view', 'viewPricing'],
      crew: ['view', 'startWork'],
      sales: ['view'],
      management: ['view', 'viewPricing']
    }
  },
  'in-progress': {
    allowedActions: ['view', 'completeWork', 'viewPricing'],
    allowedRoles: {
      client: ['view', 'viewPricing'],
      admin: ['view', 'viewPricing'],
      crew: ['view', 'completeWork'],
      sales: ['view'],
      management: ['view', 'viewPricing']
    }
  },
  'work-completed': {
    allowedActions: ['view', 'review', 'viewPricing'],
    allowedRoles: {
      client: ['view', 'viewPricing'],
      admin: ['view', 'review', 'viewPricing'],
      crew: ['view'],
      sales: ['view'],
      management: ['view', 'viewPricing']
    }
  },
  'admin-reviewed': {
    allowedActions: ['view', 'pay', 'viewPricing'],
    allowedRoles: {
      client: ['view', 'pay', 'viewPricing'],
      admin: ['view', 'viewPricing'],
      crew: ['view'],
      sales: ['view'],
      management: ['view', 'viewPricing']
    }
  },
  'final-payment-pending': {
    allowedActions: ['view', 'pay', 'viewPricing'],
    allowedRoles: {
      client: ['view', 'pay', 'viewPricing'],
      admin: ['view', 'viewPricing'],
      crew: ['view'],
      sales: ['view'],
      management: ['view', 'viewPricing']
    }
  },
  'completed': {
    allowedActions: ['view', 'viewPricing'],
    allowedRoles: {
      client: ['view', 'viewPricing'],
      admin: ['view', 'viewPricing', 'refund'],
      crew: ['view'],
      sales: ['view'],
      management: ['view', 'viewPricing']
    }
  },
  'cancelled': {
    allowedActions: ['view'],
    allowedRoles: {
      client: ['view'],
      admin: ['view', 'refund'],
      crew: ['view'],
      sales: ['view'],
      management: ['view']
    }
  }
};

export const useJobPermissions = (
  status: BookingStatus,
  userRole: UserRole,
  hasDepositPaid: boolean = false
): JobPermissions => {
  return useMemo(() => {
    const statusConfig = STATUS_PERMISSIONS[status];
    const roleActions = statusConfig?.allowedRoles[userRole] || [];

    // CRITICAL: No cancellation after deposit paid
    const canCancel = roleActions.includes('cancel') && !hasDepositPaid;
    
    // Payment only allowed after client approval
    const canPay = roleActions.includes('pay') && 
      ['client-approved', 'admin-reviewed', 'final-payment-pending'].includes(status);

    // Quote editing locked after client approval
    const allowQuoteEdit = !['client-approved', 'payment-pending', 'booking-confirmed', 
      'crew-assigned', 'in-progress', 'work-completed', 'admin-reviewed', 
      'final-payment-pending', 'completed'].includes(status);

    return {
      canView: roleActions.includes('view'),
      canEdit: roleActions.includes('edit') && allowQuoteEdit,
      canCancel,
      canPay,
      canAssignCrew: roleActions.includes('assignCrew'),
      canStartWork: roleActions.includes('startWork'),
      canCompleteWork: roleActions.includes('completeWork'),
      canReview: roleActions.includes('review'),
      canApproveQuote: roleActions.includes('approveQuote'),
      canGenerateQuote: roleActions.includes('generateQuote'),
      canViewPricing: roleActions.includes('viewPricing'),
      canRefund: roleActions.includes('refund'),
      showCancelButton: canCancel,
      showPaymentButton: canPay,
      allowQuoteEdit
    };
  }, [status, userRole, hasDepositPaid]);
};

// Action guard utility
export const useActionGuard = () => {
  return {
    guardAction: (
      action: string,
      status: BookingStatus,
      userRole: UserRole,
      hasDepositPaid: boolean = false
    ): boolean => {
      const permissions = useJobPermissions(status, userRole, hasDepositPaid);
      
      switch (action) {
        case 'cancel': return permissions.canCancel;
        case 'pay': return permissions.canPay;
        case 'edit': return permissions.canEdit;
        case 'assignCrew': return permissions.canAssignCrew;
        case 'startWork': return permissions.canStartWork;
        case 'completeWork': return permissions.canCompleteWork;
        case 'review': return permissions.canReview;
        case 'approveQuote': return permissions.canApproveQuote;
        case 'generateQuote': return permissions.canGenerateQuote;
        case 'viewPricing': return permissions.canViewPricing;
        case 'refund': return permissions.canRefund;
        default: return false;
      }
    }
  };
};