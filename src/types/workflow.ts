export type WorkflowStage = 
  | 'ai-estimate'           // Step 1: AI generates internal estimate
  | 'ops-review'            // Step 2: Operations review (mandatory)
  | 'quote-creation'        // Step 3: Final quote creation
  | 'quote-sent'            // Step 4: Quote sent to client
  | 'deposit-collection'    // Step 5: Deposit collection
  | 'job-scheduling'        // Step 6: Job scheduling
  | 'job-execution'         // Step 7: Job execution
  | 'verification-invoice'; // Step 8: Verification & final invoice

export type WorkflowStatus = 'pending' | 'in-progress' | 'completed' | 'rejected' | 'cancelled';

export interface AIEstimate {
  id: string;
  jobId: string;
  estimatedVanLoads: number;
  riskFlags: RiskFlag[];
  suggestedPriceRange: {
    min: number;
    max: number;
    recommended: number;
  };
  confidence: number; // 0-1
  analysisData: {
    photoAnalysis: PhotoAnalysisResult[];
    propertySize: string;
    wasteType: string[];
    accessConditions: AccessCondition[];
  };
  generatedAt: string;
  isInternal: true; // Never shown to client
}

export interface PhotoAnalysisResult {
  photoId: string;
  analysis: {
    wasteVolume: 'low' | 'medium' | 'high' | 'extreme';
    wasteType: string[];
    hazards: string[];
    accessIssues: string[];
  };
}

export interface AccessCondition {
  type: 'stairs' | 'narrow-access' | 'parking' | 'lift-required' | 'restricted-hours';
  severity: 'minor' | 'moderate' | 'major';
  description: string;
}

export interface RiskFlag {
  type: 'hoarder' | 'hazardous-waste' | 'poor-access' | 'structural-damage' | 'biohazard' | 'asbestos';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  requiresSpecialist: boolean;
}

export interface OperationsReview {
  id: string;
  jobId: string;
  aiEstimateId: string;
  reviewedBy: string;
  reviewedAt: string;
  decision: 'approved' | 'rejected' | 'requires-site-visit';
  
  // Pricing adjustments
  finalPrice: number;
  riskBuffer: number;
  wasteClassification: string[];
  
  // Requirements
  requiresSiteVisit: boolean;
  specialistRequired: boolean;
  additionalEquipment: string[];
  
  // Notes
  internalNotes: string;
  clientNotes?: string;
  
  // Approval data
  approvalData: {
    depositRequired: boolean;
    depositAmount?: number;
    scopeOfWork: string[];
    completionTimeline: string;
    cancellationTerms: string;
  };
}

export interface FinalQuote {
  id: string;
  jobId: string;
  opsReviewId: string;
  
  // Client-facing information only
  fixedPrice: number;
  depositAmount: number;
  scopeOfWork: string[];
  completionTimeline: string;
  cancellationTerms: string;
  
  // Quote validity
  validUntil: string;
  createdAt: string;
  sentAt?: string;
  
  // Client response
  clientResponse?: {
    accepted: boolean;
    acceptedAt: string;
    rejectedReason?: string;
  };
}

export interface DepositCollection {
  id: string;
  jobId: string;
  quoteId: string;
  
  amount: number;
  status: 'pending' | 'requested' | 'paid' | 'failed' | 'refunded';
  
  // Payment details
  paymentMethod?: 'card' | 'bank-transfer' | 'apple-pay' | 'google-pay';
  transactionId?: string;
  paidAt?: string;
  
  // Job locking
  jobLocked: boolean;
  lockedUntil?: string;
}

export interface JobScheduling {
  id: string;
  jobId: string;
  
  // Crew assignment
  assignedCrewIds: string[];
  assignedAt: string;
  assignedBy: string;
  
  // Scheduling
  scheduledDate: string;
  scheduledTimeSlot: string;
  estimatedDuration: number; // minutes
  
  // Dispatch
  dispatchGenerated: boolean;
  dispatchSentAt?: string;
  crewNotified: boolean;
}

export interface JobExecution {
  id: string;
  jobId: string;
  
  // Execution tracking
  startedAt?: string;
  completedAt?: string;
  actualDuration?: number; // minutes
  
  // Proof of completion
  completionPhotos: string[];
  completionNotes: string;
  crewSignature?: string;
  
  // Issues
  issues?: ExecutionIssue[];
  additionalWork?: AdditionalWork[];
}

export interface ExecutionIssue {
  type: 'access-denied' | 'additional-waste' | 'hazard-found' | 'equipment-failure' | 'weather';
  description: string;
  resolution: string;
  additionalCost?: number;
}

export interface AdditionalWork {
  description: string;
  approved: boolean;
  approvedBy?: string;
  cost: number;
}

export interface VerificationInvoice {
  id: string;
  jobId: string;
  
  // Verification
  verifiedBy: string;
  verifiedAt: string;
  verificationNotes: string;
  approved: boolean;
  
  // Final invoice
  finalAmount: number;
  invoiceGenerated: boolean;
  invoiceId?: string;
  invoiceSentAt?: string;
  
  // Payment
  finalPaymentStatus: 'pending' | 'paid' | 'overdue';
  finalPaymentDue: string;
}

export interface WorkflowState {
  jobId: string;
  currentStage: WorkflowStage;
  status: WorkflowStatus;
  
  // Stage data
  aiEstimate?: AIEstimate;
  opsReview?: OperationsReview;
  finalQuote?: FinalQuote;
  depositCollection?: DepositCollection;
  jobScheduling?: JobScheduling;
  jobExecution?: JobExecution;
  verificationInvoice?: VerificationInvoice;
  
  // Workflow tracking
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  
  // Stage history
  stageHistory: WorkflowStageHistory[];
}

export interface WorkflowStageHistory {
  stage: WorkflowStage;
  status: WorkflowStatus;
  startedAt: string;
  completedAt?: string;
  duration?: number; // minutes
  performedBy?: string;
  notes?: string;
}