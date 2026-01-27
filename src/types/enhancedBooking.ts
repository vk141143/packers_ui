export interface PropertyDetails {
  type: 'house' | 'apartment' | 'office' | 'storage' | 'other';
  size: 'studio' | '1-bed' | '2-bed' | '3-bed' | '4-bed' | '5+bed' | 'small-office' | 'large-office';
  floors: number;
  hasElevator: boolean;
  parkingAccess: 'direct' | 'short-walk' | 'long-walk' | 'no-parking';
  accessRestrictions: string;
}

export interface ServiceRequirements {
  serviceType: 'house-clearance' | 'office-move' | 'packing-service' | 'storage' | 'emergency-clearance';
  itemCategories: string[];
  estimatedVolume: 'small-van' | 'large-van' | 'small-truck' | 'large-truck' | 'multiple-trips';
  heavyItems: boolean;
  fragileItems: boolean;
  hazardousItems: boolean;
  packingRequired: boolean;
  storageRequired: boolean;
  urgency: 'standard' | 'urgent' | 'emergency';
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  preferredContact: 'phone' | 'email' | 'sms';
}

export interface BookingDetails {
  preferredDate: string;
  preferredTime: string;
  flexibleDates: boolean;
  alternativeDates: string[];
  timeConstraints: string;
}

export interface EnhancedBookingData {
  contactInfo: ContactInfo;
  propertyDetails: PropertyDetails;
  serviceRequirements: ServiceRequirements;
  bookingDetails: BookingDetails;
  pickupAddress: string;
  deliveryAddress?: string;
  specialInstructions: string;
  photos: File[];
  budget: string;
}

export interface QuoteCalculationFactors {
  basePrice: number;
  volumeMultiplier: number;
  urgencyMultiplier: number;
  accessDifficulty: number;
  specialItemsCharge: number;
  packingServiceCharge: number;
  storageServiceCharge: number;
  distanceCharge: number;
}

export interface DetailedQuote {
  id: string;
  bookingData: EnhancedBookingData;
  calculationFactors: QuoteCalculationFactors;
  breakdown: QuoteBreakdownItem[];
  totalPrice: number;
  validUntil: string;
  estimatedDuration: string;
  crewSize: number;
  vehicleType: string;
  additionalServices: string[];
  terms: string[];
  createdAt: string;
}

export interface QuoteBreakdownItem {
  id: string;
  description: string;
  category: 'base' | 'volume' | 'urgency' | 'access' | 'special-items' | 'packing' | 'storage' | 'distance' | 'discount';
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
}

export const ITEM_CATEGORIES = [
  'Furniture',
  'Electronics', 
  'Clothing',
  'Books/Documents',
  'Kitchen Items',
  'Appliances',
  'Garden Items',
  'Artwork',
  'Antiques',
  'Sports Equipment'
] as const;

export const VOLUME_ESTIMATES = {
  'small-van': { cubic_meters: 10, description: 'Small Van (up to 10 cubic meters)' },
  'large-van': { cubic_meters: 20, description: 'Large Van (10-20 cubic meters)' },
  'small-truck': { cubic_meters: 40, description: 'Small Truck (20-40 cubic meters)' },
  'large-truck': { cubic_meters: 60, description: 'Large Truck (40+ cubic meters)' },
  'multiple-trips': { cubic_meters: 80, description: 'Multiple Trips Required' }
} as const;

export const URGENCY_MULTIPLIERS = {
  'standard': 1.0,
  'urgent': 1.3,
  'emergency': 1.8
} as const;

export const ACCESS_DIFFICULTY_SCORES = {
  'direct': 1.0,
  'short-walk': 1.1,
  'long-walk': 1.25,
  'no-parking': 1.4
} as const;