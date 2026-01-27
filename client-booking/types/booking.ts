export interface BookingFormData {
  serviceType: string;
  propertyAddress: string;
  scheduledDate: string;
  slaType: string;
  photos: File[];
}

export interface BookingErrors {
  serviceType: string;
  propertyAddress: string;
  scheduledDate: string;
}

export interface ServiceType {
  value: string;
  label: string;
  description?: string;
}

export interface SLAType {
  value: string;
  label: string;
  description: string;
  priceModifier?: number;
}

export interface JobDraft {
  id: string;
  property_address: string;
  date: string;
  time: string;
  service_type: string;
  service_level: string;
  status: 'draft' | 'pending' | 'confirmed';
  created_at: string;
}

export interface BookingResponse {
  success: boolean;
  data?: JobDraft;
  error?: string;
}

export const SERVICE_TYPES: ServiceType[] = [
  { value: 'house-clearance', label: 'House Clearance' },
  { value: 'office-move', label: 'Office Move' },
  { value: 'emergency-clearance', label: 'Emergency Clearance' },
  { value: 'property-turnover', label: 'Property Turnover' },
];

export const SLA_TYPES: SLAType[] = [
  { 
    value: '24h', 
    label: 'Emergency (24h)', 
    description: '£50 extra',
    priceModifier: 50
  },
  { 
    value: '48h', 
    label: 'Standard (48h)', 
    description: 'Standard pricing'
  },
  { 
    value: '72h', 
    label: 'Economy (72h)', 
    description: '10% discount',
    priceModifier: -0.1
  },
];