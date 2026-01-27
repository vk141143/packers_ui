/**
 * Utility functions for managing booking data persistence across authentication flows
 */

export interface BookingData {
  serviceType: string;
  propertyAddress?: string;
  pickupAddress?: string;
  scheduledDate: string;
  scheduledTime: string;
  slaType: string;
  notes?: string;
  timestamp?: string;
  source?: string;
  estimatedPrice?: number;
  [key: string]: any;
}

const STORAGE_KEYS = {
  PENDING_BOOKING: 'pendingBookingData',
  PRICE_ESTIMATE: 'priceEstimateData', // Legacy key for compatibility
  LEGACY_PENDING: 'pendingBooking' // Legacy key for compatibility
};

/**
 * Save booking data to session storage with proper metadata
 */
export const saveBookingData = (data: BookingData): void => {
  const bookingData: BookingData = {
    ...data,
    timestamp: new Date().toISOString(),
    source: data.source || 'unknown'
  };

  try {
    // Store with primary key
    sessionStorage.setItem(STORAGE_KEYS.PENDING_BOOKING, JSON.stringify(bookingData));
    // Also store with legacy key for compatibility
    sessionStorage.setItem(STORAGE_KEYS.PRICE_ESTIMATE, JSON.stringify(bookingData));
    
    console.log('Booking data saved:', bookingData);
  } catch (error) {
    console.error('Failed to save booking data:', error);
  }
};

/**
 * Load booking data from session storage, checking all possible keys
 */
export const loadBookingData = (): BookingData | null => {
  const keys = [
    STORAGE_KEYS.PENDING_BOOKING,
    STORAGE_KEYS.PRICE_ESTIMATE,
    STORAGE_KEYS.LEGACY_PENDING
  ];

  for (const key of keys) {
    try {
      const data = sessionStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        console.log(`Booking data loaded from ${key}:`, parsed);
        return parsed;
      }
    } catch (error) {
      console.error(`Failed to parse booking data from ${key}:`, error);
    }
  }

  console.log('No booking data found in session storage');
  return null;
};

/**
 * Clear all booking data from session storage
 */
export const clearBookingData = (): void => {
  const keys = Object.values(STORAGE_KEYS);
  
  keys.forEach(key => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  });

  console.log('All booking data cleared from session storage');
};

/**
 * Check if booking data exists in session storage
 */
export const hasBookingData = (): boolean => {
  const keys = Object.values(STORAGE_KEYS);
  return keys.some(key => sessionStorage.getItem(key) !== null);
};

/**
 * Transform booking data for form consumption
 */
export const transformBookingDataForForm = (data: BookingData) => {
  return {
    serviceType: data.serviceType || 'emergency-clearance',
    propertyAddress: data.propertyAddress || data.pickupAddress || '',
    scheduledDate: data.scheduledDate || '',
    scheduledTime: data.scheduledTime || '',
    slaType: data.slaType || '48h',
    notes: data.notes || '',
    accessInstructions: data.accessInstructions || '',
  };
};