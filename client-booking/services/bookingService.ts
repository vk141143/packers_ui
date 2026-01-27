import { createJobDraft } from '../../src/services/api';

export interface BookingData {
  serviceType: string;
  propertyAddress: string;
  scheduledDate: string;
  slaType: string;
  photos: File[];
}

export interface JobDraftRequest {
  property_address: string;
  date: string;
  time: string;
  service_type: string;
  service_level: string;
  property_photos: File[];
}

export class BookingService {
  static async createBookingDraft(bookingData: BookingData) {
    try {
      const jobDraftRequest: JobDraftRequest = {
        property_address: bookingData.propertyAddress,
        date: bookingData.scheduledDate,
        time: '10:00',
        service_type: bookingData.serviceType,
        service_level: bookingData.slaType,
        property_photos: bookingData.photos,
      };

      const response = await createJobDraft(jobDraftRequest);
      
      if (response.success) {
        // Store successful draft
        sessionStorage.setItem('pendingBooking', JSON.stringify({ 
          ...bookingData, 
          jobDraft: response.data 
        }));
        return { success: true, data: response.data };
      } else {
        // Store client-side form data as fallback
        sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
        return { success: false, error: response.error };
      }
    } catch (error) {
      // Store client-side form data as fallback
      sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      return { success: false, error: 'Network error occurred' };
    }
  }

  static validateBookingData(bookingData: BookingData) {
    const errors = {
      serviceType: !bookingData.serviceType ? 'Please select a service type' : '',
      propertyAddress: !bookingData.propertyAddress.trim() ? 'Property address is required' : '',
      scheduledDate: !bookingData.scheduledDate ? 'Please select a date' : '',
    };

    // Check if date is in the past
    if (bookingData.scheduledDate && new Date(bookingData.scheduledDate) < new Date()) {
      errors.scheduledDate = 'Date cannot be in the past';
    }

    return errors;
  }

  static hasValidationErrors(errors: Record<string, string>) {
    return Object.values(errors).some(error => error !== '');
  }
}