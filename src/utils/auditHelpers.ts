import { Job, ExecutionTimeline } from '../types';

export interface AuditEvent {
  id: string;
  event: string;
  timestamp: string;
  actor?: string;
  description: string;
  icon: string;
}

export const generateAuditTimeline = (job: Job): AuditEvent[] => {
  const events: AuditEvent[] = [];

  events.push({
    id: '1',
    event: 'Job Created',
    timestamp: job.createdAt,
    actor: job.clientName,
    description: `Job ${job.immutableReferenceId} created`,
    icon: 'FileText',
  });

  if (job.dispatchedAt) {
    events.push({
      id: '2',
      event: 'Dispatched',
      timestamp: job.dispatchedAt,
      actor: 'Operations',
      description: `Assigned to crew: ${job.crewAssigned?.join(', ') || 'N/A'}`,
      icon: 'Send',
    });
  }

  if (job.startedAt) {
    events.push({
      id: '3',
      event: 'Crew Started',
      timestamp: job.startedAt,
      actor: job.crewAssigned?.[0] || 'Crew',
      description: 'On-site execution commenced',
      icon: 'Play',
    });
  }

  if (job.checklist && job.checklist.every(item => item.completed)) {
    const lastCompleted = job.checklist
      .filter(item => item.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0];
    
    if (lastCompleted?.completedAt) {
      events.push({
        id: '4',
        event: 'Checklist Completed',
        timestamp: lastCompleted.completedAt,
        actor: lastCompleted.completedBy || 'Crew',
        description: `All ${job.checklist.length} tasks completed`,
        icon: 'CheckCircle',
      });
    }
  }

  if (job.photos && job.photos.length > 0) {
    const lastPhoto = job.photos.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];
    
    events.push({
      id: '5',
      event: 'Evidence Uploaded',
      timestamp: lastPhoto.uploadedAt,
      actor: lastPhoto.uploadedBy,
      description: `${job.photos.length} photo(s) uploaded`,
      icon: 'Camera',
    });
  }

  if (job.completedAt) {
    events.push({
      id: '6',
      event: 'Job Completed',
      timestamp: job.completedAt,
      actor: job.crewAssigned?.[0] || 'Crew',
      description: 'Execution completed',
      icon: 'CheckCircle2',
    });
  }

  if (job.reportGenerated && job.verifiedAt) {
    events.push({
      id: '7',
      event: 'Report Generated',
      timestamp: job.verifiedAt,
      actor: 'System',
      description: 'Compliance report auto-generated',
      icon: 'FileCheck',
    });
  }

  if (job.invoiceId) {
    events.push({
      id: '8',
      event: 'Invoice Generated',
      timestamp: job.verifiedAt || job.completedAt || new Date().toISOString(),
      actor: 'System',
      description: `Invoice ${job.invoiceId}`,
      icon: 'Receipt',
    });
  }

  return events.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

export const getSLAStatusBadge = (job: Job): {
  status: 'on_track' | 'at_risk' | 'breached';
  label: string;
  color: string;
} => {
  if (job.completedAt) {
    const breached = new Date(job.completedAt) > new Date(job.slaDeadline);
    return breached
      ? { status: 'breached', label: 'SLA Breached', color: 'red' }
      : { status: 'on_track', label: 'SLA Met', color: 'green' };
  }

  const now = new Date();
  const deadline = new Date(job.slaDeadline);
  const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursRemaining < 0) {
    return { status: 'breached', label: 'SLA Breached', color: 'red' };
  }

  if (hoursRemaining < 6) {
    return { status: 'at_risk', label: 'At Risk', color: 'orange' };
  }

  return { status: 'on_track', label: 'On Track', color: 'green' };
};

export const getCrewAccountability = (job: Job): {
  assignedCrew: string[];
  executedBy: string | null;
  evidenceUploadedBy: string[];
} => {
  return {
    assignedCrew: job.crewAssigned || [],
    executedBy: job.checklist?.find(item => item.completedBy)?.completedBy || null,
    evidenceUploadedBy: [...new Set(job.photos?.map(p => p.uploadedBy) || [])],
  };
};

export const buildExecutionTimeline = (job: Job): ExecutionTimeline => {
  return {
    created: job.createdAt,
    dispatched: job.dispatchedAt,
    started: job.startedAt,
    completed: job.completedAt,
    verified: job.verifiedAt,
    invoiced: job.invoiceId ? (job.verifiedAt || job.completedAt) : undefined,
  };
};
