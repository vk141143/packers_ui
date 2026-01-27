// Core booking types
export interface BookingRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: 'house-clearance' | 'office-move' | 'emergency-clearance';
  propertyAddress: string;
  scheduledDate: string;
  scheduledTime: string;
  specialRequirements?: string;
  estimatedPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
  createdAt: string;
  // Cancellation fields
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  refundStatus?: 'pending' | 'processed' | 'failed';
  refundAmount?: number;
  refundedAt?: string;
  depositPaid?: boolean;
  depositAmount?: number;
}

export interface BookingFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  propertyAddress: string;
  scheduledDate: string;
  scheduledTime: string;
  propertySize: string;
  vanLoads: string;
  wasteTypes: string[];
  accessDifficulty: string[];
  complianceAddons: string[];
  specialRequirements: string;
}