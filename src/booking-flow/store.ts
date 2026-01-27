import { BookingRequest } from './types';

class BookingFlowStore {
  private bookings: Map<string, BookingRequest> = new Map();
  private listeners: Set<() => void> = new Set();
  private batchTimeout: NodeJS.Timeout | null = null;
  private pendingUpdates = false;

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    if (this.batchTimeout) return;
    
    this.batchTimeout = setTimeout(() => {
      this.listeners.forEach(listener => {
        try {
          listener();
        } catch (error) {
          console.error('Store listener error:', error);
        }
      });
      this.batchTimeout = null;
    }, 16); // 60fps batching
  }

  createBooking(data: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>): BookingRequest {
    const booking: BookingRequest = {
      ...data,
      id: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.bookings.set(booking.id, booking);
    this.notify();
    return booking;
  }

  getBookings(): BookingRequest[] {
    return Array.from(this.bookings.values());
  }

  getBookingById(id: string): BookingRequest | undefined {
    return this.bookings.get(id);
  }

  updateBookingStatus(id: string, status: BookingRequest['status']): boolean {
    const booking = this.bookings.get(id);
    if (!booking) return false;

    booking.status = status;
    this.notify();
    return true;
  }

  cancelBooking(id: string, reason: string, cancelledBy: string): boolean {
    const booking = this.bookings.get(id);
    if (!booking) return false;

    // Check if cancellation is allowed
    if (booking.depositPaid) return false;
    if (booking.status === 'completed' || booking.status === 'cancelled') return false;

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancelledBy = cancelledBy;
    booking.cancelledAt = new Date().toISOString();
    
    this.notify();
    return true;
  }

  processRefund(id: string, refundAmount: number): boolean {
    const booking = this.bookings.get(id);
    if (!booking || booking.status !== 'cancelled') return false;

    booking.status = 'refunded';
    booking.refundStatus = 'processed';
    booking.refundAmount = refundAmount;
    booking.refundedAt = new Date().toISOString();
    
    this.notify();
    return true;
  }

  calculatePrice(serviceType: string): number {
    const basePrices: Record<string, number> = {
      'house-clearance': 300,
      'office-move': 500,
      'emergency-clearance': 400
    };
    return basePrices[serviceType] || 300;
  }

  cleanup() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
    this.listeners.clear();
  }
}

export const bookingFlowStore = new BookingFlowStore();