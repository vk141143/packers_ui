import { BookingFormData, BookingErrors } from '../types/booking';

export class BookingUtils {
  /**
   * Validates booking form data
   */
  static validateForm(formData: BookingFormData): BookingErrors {
    const errors: BookingErrors = {
      serviceType: '',
      propertyAddress: '',
      scheduledDate: '',
    };

    if (!formData.serviceType) {
      errors.serviceType = 'Please select a service type';
    }

    if (!formData.propertyAddress.trim()) {
      errors.propertyAddress = 'Property address is required';
    }

    if (!formData.scheduledDate) {
      errors.scheduledDate = 'Please select a date';
    } else if (new Date(formData.scheduledDate) < new Date()) {
      errors.scheduledDate = 'Date cannot be in the past';
    }

    return errors;
  }

  /**
   * Checks if there are any validation errors
   */
  static hasErrors(errors: BookingErrors): boolean {
    return Object.values(errors).some(error => error !== '');
  }

  /**
   * Formats date for display
   */
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Gets minimum selectable date (tomorrow)
   */
  static getMinDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  /**
   * Calculates estimated price based on service type and SLA
   */
  static calculateEstimatedPrice(serviceType: string, slaType: string): number {
    const basePrices: Record<string, number> = {
      'house-clearance': 200,
      'office-move': 300,
      'emergency-clearance': 400,
      'property-turnover': 250,
    };

    let basePrice = basePrices[serviceType] || 200;

    // Apply SLA modifiers
    switch (slaType) {
      case '24h':
        basePrice += 50; // Emergency surcharge
        break;
      case '72h':
        basePrice *= 0.9; // 10% discount
        break;
      default:
        // Standard 48h pricing
        break;
    }

    return Math.round(basePrice);
  }

  /**
   * Stores booking data in session storage
   */
  static storeBookingData(formData: BookingFormData, jobDraft?: any): void {
    const bookingData = jobDraft 
      ? { ...formData, jobDraft }
      : formData;
    
    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
  }

  /**
   * Retrieves booking data from session storage
   */
  static getStoredBookingData(): BookingFormData | null {
    try {
      const stored = sessionStorage.getItem('pendingBooking');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  /**
   * Clears stored booking data
   */
  static clearStoredBookingData(): void {
    sessionStorage.removeItem('pendingBooking');
  }
}