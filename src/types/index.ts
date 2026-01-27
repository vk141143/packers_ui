export type UserRole = 'client' | 'admin' | 'crew' | 'management' | 'sales';

export type JobStatus = 
  | 'client-booking-request'  // Step 1: Client submits booking
  | 'admin-quoted'            // Step 2: Admin provides quote
  | 'quote-rejected'          // Step 3a: Client rejects quote
  | 'client-approved'         // Step 3: Client approves quote
  | 'payment-pending'         // Step 4: Awaiting payment
  | 'booking-confirmed'       // Step 5: Payment received, booking confirmed
  | 'crew-assigned'           // Step 6: Crew assigned to job
  | 'in-progress'             // Step 7: Work in progress
  | 'work-completed'          // Step 8: Crew completed work
  | 'admin-reviewed'          // Step 9: Admin reviewed and approved
  | 'admin-verified'          // Step 9b: Admin verified with final price
  | 'final-payment-pending'   // Step 10: Final payment requested
  | 'completed'               // Step 11: Fully completed
  | 'admin-rejected'          // Admin rejected work
  | 'cancelled'
  | 'refunded';

export type JobLifecycleState = 
  | 'created'           // Initial booking creation
  | 'pending-admin'     // Awaiting admin review
  | 'assigned'          // Crew assigned by admin
  | 'in-progress'       // Work in progress
  | 'pending-verification' // Awaiting admin verification
  | 'completed'         // Fully completed
  | 'invoiced';         // Invoice generated

export type AccessMethod = 'keys' | 'locksmith' | 'agent' | 'tenant-present';

export type OccupancyStatus = 'occupied' | 'void' | 'partially-occupied';

export type RiskFlag = 'biohazard' | 'hoarding' | 'fire-damage' | 'flood-damage' | 'structural' | 'asbestos';

export type JobSize = 'S' | 'M' | 'L' | 'XL';

export type PropertyType = 'flat' | 'house' | 'commercial' | 'storage';

export type PhotoCategory = 'before' | 'during' | 'after' | 'damage' | 'evidence';

export type ServiceType = 
  | 'emergency-clearance'
  | 'hoarder-clearout'
  | 'fire-flood-moveout'
  | 'probate-clearance'
  | 'void-turnover'
  | 'furniture-removal'
  | 'lock-change'
  | 'minor-repairs';

export type ClientType = 'council' | 'housing-association' | 'landlord' | 'insurer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  clientType?: ClientType;
}

export interface Job {
  id: string;
  immutableReferenceId: string;
  clientName: string;
  clientId: string;
  clientType: ClientType;
  clientDetails?: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    contactPerson?: string;
  };
  serviceType: ServiceType;
  serviceId?: number | null;
  propertyAddress: string;
  pickupAddress: string;
  scheduledDate: string;
  status: JobStatus;
  lifecycleState: JobLifecycleState;
  estimatedValue: number;
  actualCost?: number;
  
  // Quote Details
  quoteDetails?: {
    quotedBy: string;
    quotedAt: string;
    quotedAmount: number;
    depositAmount?: number;
    breakdown: {
      basePrice: number;
      depositRequired?: number;
      additionalCharges?: { description: string; amount: number }[];
    };
    validUntil: string;
    notes?: string;
  };
  
  // Final Quote (enhanced structure for client acceptance)
  finalQuote?: {
    fixedPrice: number;
    depositAmount: number;
    scopeOfWork: string[];
    completionTimeline: string;
    cancellationTerms: string;
    validUntil: string;
    quotedBy: string;
    quotedAt: string;
  };
  
  // Client Approval
  clientApproval?: {
    approvedAt: string;
    approvedBy: string;
  };
  
  // Payment Tracking
  initialPayment?: {
    amount: number;
    paidAt?: string;
    transactionId?: string;
    method?: 'card' | 'apple-pay' | 'google-pay' | 'paypal';
  };
  
  finalPayment?: {
    amount: number;
    paidAt?: string;
    transactionId?: string;
    method?: 'card' | 'apple-pay' | 'google-pay' | 'paypal';
  };
  
  // Admin Review
  adminReview?: {
    reviewedBy: string;
    reviewedAt: string;
    approved: boolean;
    notes?: string;
  };
  notes?: string;
  description?: string;
  propertySize?: string;
  vanLoads?: string;
  wasteTypes?: string[];
  accessDifficulty?: string[];
  complianceAddons?: string[];
  photos?: Photo[];
  checklist?: ChecklistItem[];
  geoLocation?: GeoLocation;
  completedAt?: string;
  verifiedAt?: string;
  dispatchedAt?: string;
  startedAt?: string;
  createdAt: string;
  urgency: 'emergency' | 'standard';
  proofRequired: boolean;
  reportGenerated?: boolean;
  reportUrl?: string;
  invoiceId?: string;
  invoiceGenerated?: boolean;
  invoiceStatus?: 'pending' | 'generated' | 'sent' | 'paid';
  invoiceSentAt?: string;
  invoiceGeneratedAt?: string;
  finalAmount?: number;
  finalPrice?: number;
  verifiedFinalPrice?: number;
  verifiedBy?: string;
  finalAmountSentAt?: string;
  paymentStatus?: 'pending' | 'success' | 'failed';
  paymentMethod?: 'card' | 'apple-pay' | 'google-pay' | 'paypal';
  paidAt?: string;
  refundStatus?: 'pending' | 'processed' | 'failed';
  refundedAt?: string;
  refundAmount?: number;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  accessMethod?: AccessMethod;
  occupancyStatus?: OccupancyStatus;
  riskFlags?: RiskFlag[];
  jobSize?: JobSize;
  propertyType?: PropertyType;
  executionTimeline?: ExecutionTimeline;
  sameCrewRequired?: boolean;
  otpCode?: string;
  otpVerified?: boolean;
  otpVerifiedAt?: string;
  beforePhotosRequired?: boolean;
  afterPhotosRequired?: boolean;
  adminVerificationRequired?: boolean;
  vehicleType?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  statusHistory?: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  updatedBy: string;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  autoCompleted?: boolean;
  requiresPhoto?: boolean;
  photoUrl?: string;
  order: number;
}

export interface Photo {
  id: string;
  url: string;
  type: 'before' | 'after';
  category?: PhotoCategory;
  uploadedAt: string;
  uploadedBy: string;
  geoStamp?: GeoLocation;
  geoVerified?: boolean;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface Invoice {
  id: string;
  jobId: string;
  immutableJobReference: string;
  amount: number;
  lineItems: InvoiceLineItem[];
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  pdfUrl: string;
  paymentMethod?: 'stripe' | 'invoice';
  contractType?: 'one-off' | 'subscription';
  generatedAt: string;
  autoGenerated: boolean;
  locked: boolean;
  manualAdjustment?: ManualAdjustment;
}

export interface Contract {
  id: string;
  clientId: string;
  type: 'one-off' | 'recurring';
  startDate: string;
  endDate?: string;
  monthlyValue?: number;
  status: 'active' | 'expired';
}

export interface KPI {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  amount: number;
  category: 'base' | 'emergency-premium' | 'risk-surcharge' | 'adjustment';
}

export interface ManualAdjustment {
  amount: number;
  reason: string;
  adjustedBy: string;
  adjustedAt: string;
}

export interface ExecutionTimeline {
  created: string;
  dispatched?: string;
  started?: string;
  completed?: string;
  verified?: string;
  invoiced?: string;
}

export interface ComplianceReport {
  jobReferenceId: string;
  crewIds: string[];
  executionTimeline: ExecutionTimeline;
  riskDeclaration: string;
  evidenceSummary: EvidenceSummary;
  generatedAt: string;
  locked: boolean;
}

export interface EvidenceSummary {
  beforePhotos: number;
  afterPhotos: number;
  checklistCompletion: number;
  geoVerified: boolean;
  totalWorkMinutes: number;
}

export interface CrewRegistrationResponse {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  drivers_license: string;
  dbs_certificate: string;
  proof_of_address: string;
  insurance_certificate: string;
  right_to_work: string;
  is_approved: boolean;
  status: 'available' | 'busy' | 'offline';
}

export interface CrewProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  address: string | null;
  is_approved: boolean;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  organization_name: string | null;
  department: string | null;
  created_at: string;
}

export interface CrewJob {
  job_id: string;
  property_address: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  time_remaining: string;
  countdown_timer: string;
}

export interface CrewRatings {
  crew_id: string;
  crew_name: string;
  total_completed_jobs: number;
  total_rated_jobs: number;
  average_rating: number;
  ratings: any[];
}

export interface AdminInfo {
  organization_name: string;
  department: string;
}

export interface Quote {
  job_id: string;
  property_address: string;
  service_type: string;
  preferred_date: string;
  quote_amount: number;
  deposit_amount: number;
  quote_notes: string;
  status: string;
  created_at: string;
}
