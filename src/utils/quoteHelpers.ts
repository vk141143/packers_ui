// PART 6: WORKFLOW STATE CONSISTENCY HELPERS
import { Job } from '../types';

export const getWorkflowStage = (job: Job): Job['status'] => {
  return job.status;
};

export const isQuoteLocked = (job: Job): boolean => {
  return job.finalQuote?.locked || 
         ['client-approved', 'payment-pending', 'booking-confirmed', 
          'crew-assigned', 'crew-dispatched', 'in-progress', 
          'work-completed', 'completed'].includes(job.status);
};

export const canEditQuote = (job: Job): boolean => {
  return !isQuoteLocked(job) && job.status === 'client-booking-request';
};

export const getQuoteStatus = (job: Job): 'pending' | 'sent' | 'accepted' | 'locked' => {
  if (job.status === 'client-booking-request') return 'pending';
  if (job.status === 'admin-quoted') return 'sent';
  if (job.status === 'client-approved') return 'accepted';
  if (isQuoteLocked(job)) return 'locked';
  return 'pending';
};

// PART 3: ATOMIC UPDATE HELPER
export const createAtomicQuoteUpdate = (job: Job, quoteData: any) => {
  return {
    quoteDetails: quoteData,
    finalQuote: {
      fixedPrice: quoteData.quotedAmount,
      depositAmount: quoteData.depositAmount,
      locked: false,
      quotedBy: quoteData.quotedBy,
      quotedAt: quoteData.quotedAt,
      validUntil: quoteData.validUntil,
      scopeOfWork: quoteData.scopeOfWork || [
        'Initial property assessment and planning',
        'Professional packing and protection of items',
        'Safe loading and transportation',
        'Unloading and placement at destination',
        'Final cleanup and inspection'
      ]
    },
    status: 'admin-quoted' as Job['status'],
    statusHistory: [...(job.statusHistory || []), {
      status: 'admin-quoted' as Job['status'],
      timestamp: new Date().toISOString(),
      updatedBy: quoteData.quotedBy,
      notes: `Quote provided: £${quoteData.quotedAmount} (Deposit: £${quoteData.depositAmount})`
    }]
  };
};