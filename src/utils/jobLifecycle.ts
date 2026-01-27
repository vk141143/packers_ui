import { Job, JobLifecycleState } from '../types';

export const JOB_LIFECYCLE_FLOW: Record<JobLifecycleState, JobLifecycleState | null> = {
  created: 'pending-admin',
  'pending-admin': 'assigned',
  assigned: 'in-progress',
  'in-progress': 'pending-verification',
  'pending-verification': 'completed',
  completed: 'invoiced',
  invoiced: null,
};

export const canTransitionTo = (currentState: JobLifecycleState, targetState: JobLifecycleState): boolean => {
  const nextState = JOB_LIFECYCLE_FLOW[currentState];
  if (nextState === targetState) return true;
  if (nextState && JOB_LIFECYCLE_FLOW[nextState]) {
    return canTransitionTo(nextState, targetState);
  }
  return false;
};

export const canDispatchJob = (job: Job): { allowed: boolean; reason?: string } => {
  if (!['quote-accepted', 'deposit-paid'].includes(job.status)) {
    return { allowed: false, reason: 'Quote must be accepted and deposit paid' };
  }
  if (!job.crewAssigned || job.crewAssigned.length === 0) {
    return { allowed: false, reason: 'Crew must be assigned before dispatch' };
  }
  return { allowed: true };
};

export const canStartJob = (job: Job): { allowed: boolean; reason?: string } => {
  if (job.lifecycleState === 'in-progress') {
    return { allowed: true };
  }
  if (job.lifecycleState !== 'assigned' || job.status !== 'crew-dispatched') {
    return { allowed: false, reason: 'Crew must be dispatched first' };
  }
  return { allowed: true };
};

export const canCompleteJob = (job: Job): { allowed: boolean; reason?: string } => {
  if (job.status !== 'in-progress') {
    return { allowed: false, reason: 'Job must be in progress' };
  }
  
  return { allowed: true };
};

export const canVerifyJob = (job: Job): { allowed: boolean; reason?: string } => {
  if (job.status !== 'work-completed') {
    return { allowed: false, reason: 'Job must be completed by crew first' };
  }
  
  return { allowed: true };
};

export const canInvoiceJob = (job: Job): { allowed: boolean; reason?: string } => {
  if (job.lifecycleState !== 'completed') {
    return { allowed: false, reason: 'Job must be completed and verified first' };
  }
  if (!job.depositPaid) {
    return { allowed: false, reason: 'Deposit must be paid first' };
  }
  
  return { allowed: true };
};

export const getNextAction = (job: Job): string => {
  switch (job.status) {
    case 'created':
      return 'Ops Review';
    case 'pending-ops-review':
    case 'ops-reviewing':
      return 'Approve & Send Quote';
    case 'quote-ready':
    case 'quote-sent':
      return 'Awaiting Client Acceptance';
    case 'awaiting-acceptance':
      return 'Client to Accept Quote';
    case 'quote-accepted':
      return 'Collect Deposit';
    case 'deposit-required':
      return 'Awaiting Deposit Payment';
    case 'deposit-paid':
      return 'Assign Crew';
    case 'crew-assigned':
      return 'Dispatch Crew';
    case 'crew-dispatched':
      return 'Start Work';
    case 'work-completed':
      return 'Admin Verification';
    case 'pending-verification':
      return 'Verify & Send Final Invoice';
    case 'final-invoice-sent':
      return 'Awaiting Final Payment';
    case 'completed':
      return 'Job Complete';
    default:
      return 'Unknown';
  }
};

export const isJobActionable = (job: Job): boolean => {
  return job.lifecycleState !== 'invoiced' && job.status !== 'cancelled';
};

export const requiresUrgentAction = (job: Job): boolean => {
  if (job.status === 'cancelled' || job.lifecycleState === 'invoiced') return false;
  
  const now = new Date();
  const deadline = new Date(job.slaDeadline);
  const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return hoursRemaining < 12 || job.urgency === 'emergency';
};
