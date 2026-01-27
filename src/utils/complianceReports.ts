import { Job, ComplianceReport, EvidenceSummary, ExecutionTimeline } from '../types';

export const generateExecutionTimeline = (job: Job): ExecutionTimeline => {
  return {
    created: job.createdAt,
    dispatched: job.dispatchedAt,
    started: job.startedAt,
    completed: job.completedAt,
    verified: job.verifiedAt,
    invoiced: job.invoiceId ? new Date().toISOString() : undefined,
  };
};

export const generateEvidenceSummary = (job: Job): EvidenceSummary => {
  const beforePhotos = job.photos?.filter(p => p.type === 'before' && p.uploadedBy !== 'Client').length || 0;
  const afterPhotos = job.photos?.filter(p => p.type === 'after').length || 0;
  const checklistCompletion = job.checklist?.filter(i => i.completed).length || 0;
  const geoVerified = job.photos?.some(p => p.geoVerified) || false;
  
  const totalWorkMinutes = job.completionTimeMinutes || 0;

  return {
    beforePhotos,
    afterPhotos,
    checklistCompletion,
    geoVerified,
    totalWorkMinutes,
  };
};

export const generateRiskDeclaration = (job: Job): string => {
  if (!job.riskFlags || job.riskFlags.length === 0) {
    return 'No significant risks identified. Standard safety protocols applied.';
  }

  const riskDescriptions = {
    'biohazard': 'Biohazard protocols implemented',
    'hoarding': 'Specialist hoarding clearance procedures followed',
    'fire-damage': 'Fire damage assessment and safe removal completed',
    'flood-damage': 'Water damage protocols and drying procedures applied',
    'structural': 'Structural safety assessment conducted',
    'asbestos': 'Asbestos handling procedures strictly followed',
  };

  const declarations = job.riskFlags.map(flag => riskDescriptions[flag] || flag);
  return `Risk factors identified: ${job.riskFlags.join(', ')}. ${declarations.join('. ')}.`;
};

export const generateComplianceReport = (job: Job): ComplianceReport => {
  if (job.lifecycleState !== 'completed' && job.lifecycleState !== 'verified' && job.lifecycleState !== 'invoiced') {
    throw new Error('Cannot generate compliance report for incomplete job');
  }

  const beforePhotos = job.photos?.filter(p => p.type === 'before' && p.uploadedBy !== 'Client') || [];
  const afterPhotos = job.photos?.filter(p => p.type === 'after') || [];

  if (beforePhotos.length === 0 || afterPhotos.length === 0) {
    throw new Error('Evidence photos required for compliance report');
  }

  const report: ComplianceReport = {
    jobReferenceId: job.immutableReferenceId,
    crewIds: job.crewIds || [],
    executionTimeline: generateExecutionTimeline(job),
    riskDeclaration: generateRiskDeclaration(job),
    evidenceSummary: generateEvidenceSummary(job),
    generatedAt: new Date().toISOString(),
    locked: true,
  };

  return report;
};

export const validateComplianceReadiness = (job: Job): { ready: boolean; issues: string[] } => {
  const issues: string[] = [];

  if (!job.immutableReferenceId) {
    issues.push('Missing immutable reference ID');
  }

  if (!job.crewIds || job.crewIds.length === 0) {
    issues.push('Crew IDs not recorded');
  }

  const beforePhotos = job.photos?.filter(p => p.type === 'before' && p.uploadedBy !== 'Client') || [];
  const afterPhotos = job.photos?.filter(p => p.type === 'after') || [];

  if (beforePhotos.length === 0) {
    issues.push('Before photos missing');
  }

  if (afterPhotos.length === 0) {
    issues.push('After photos missing');
  }

  const incompleteTasks = job.checklist?.filter(item => !item.completed) || [];
  if (incompleteTasks.length > 0) {
    issues.push(`${incompleteTasks.length} checklist items incomplete`);
  }

  if (!job.completedAt) {
    issues.push('Job not completed');
  }

  return {
    ready: issues.length === 0,
    issues,
  };
};
