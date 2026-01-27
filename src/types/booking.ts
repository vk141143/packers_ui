export type BookingStatus = 
  | 'quote-requested'      // Initial quote request
  | 'quote-generated'      // System generated estimate
  | 'pending-admin'        // Waiting for admin review
  | 'admin-quoted'         // Admin provided final quote
  | 'client-approved'      // Client approved final quote
  | 'payment-pending'      // Awaiting payment
  | 'booking-confirmed'    // Payment completed, booking confirmed
  | 'crew-assigned'        // Crew assigned to job
  | 'in-progress'          // Job in progress
  | 'work-completed'       // Work completed, awaiting admin review
  | 'admin-reviewed'       // Admin reviewed work
  | 'final-payment-pending' // Final payment required
  | 'completed'            // Fully completed with invoice
  | 'cancelled';

export type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed' | 'refunded';

export interface BookingQuote {
  id: string;
  estimatedPrice: number;
  finalPrice?: number;
  breakdown: PriceBreakdown[];
  isEstimate: boolean;
  validUntil: string;
  createdAt: string;
  updatedAt?: string;
  adminNotes?: string;
}

export interface PriceBreakdown {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: 'base' | 'premium' | 'additional' | 'discount';
}

export interface BookingPayment {
  id: string;
  bookingId: string;
  amount: number;
  type: 'initial' | 'final';
  status: PaymentStatus;
  method?: 'card' | 'apple-pay' | 'google-pay' | 'paypal';
  transactionId?: string;
  paidAt?: string;
  failureReason?: string;
}

export interface Booking {
  id: string;
  referenceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  
  // Service Details
  serviceType: string;
  propertyAddress: string;
  pickupAddress?: string;
  scheduledDate: string;
  urgency: 'standard' | 'emergency';
  
  // Booking Flow
  status: BookingStatus;
  quote: BookingQuote;
  payments: BookingPayment[];
  
  // Admin Review
  adminReviewedAt?: string;
  adminReviewedBy?: string;
  adminNotes?: string;
  
  // Crew Assignment
  assignedCrewIds?: string[];
  assignedAt?: string;
  
  // Work Progress
  workStartedAt?: string;
  workCompletedAt?: string;
  finalReviewAt?: string;
  finalAmount?: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Additional
  notes?: string;
  photos?: string[];
  statusHistory: BookingStatusHistory[];
}

export interface BookingStatusHistory {
  status: BookingStatus;
  timestamp: string;
  updatedBy: string;
  notes?: string;
}