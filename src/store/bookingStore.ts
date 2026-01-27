import { Booking, BookingStatus, BookingQuote, BookingPayment, PriceBreakdown } from '../types/booking';

class BookingStore {
  private bookings: Booking[] = [];
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // Step 1: Create initial quote request
  createQuoteRequest(data: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    serviceType: string;
    propertyAddress: string;
    pickupAddress?: string;
    scheduledDate: string;
    urgency: 'standard' | 'emergency';
    notes?: string;
  }): Booking {
    const estimatedPrice = this.calculateEstimatedPrice(data);
    const breakdown = this.generatePriceBreakdown(data, estimatedPrice);
    
    const booking: Booking = {
      id: `BOOK-${Date.now()}`,
      referenceNumber: `REF-${Date.now()}`,
      clientId: `CLIENT-${Date.now()}`,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      serviceType: data.serviceType,
      propertyAddress: data.propertyAddress,
      pickupAddress: data.pickupAddress,
      scheduledDate: data.scheduledDate,
      urgency: data.urgency,
      status: 'quote-generated',
      quote: {
        id: `QUOTE-${Date.now()}`,
        estimatedPrice,
        breakdown,
        isEstimate: true,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      },
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: data.notes,
      statusHistory: [{
        status: 'quote-generated',
        timestamp: new Date().toISOString(),
        updatedBy: 'System',
        notes: 'Initial quote generated'
      }]
    };

    this.bookings.unshift(booking);
    this.notify();
    return booking;
  }

  // Step 2: Submit booking for admin review
  submitForAdminReview(bookingId: string): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking || booking.status !== 'quote-generated') return false;

    booking.status = 'pending-admin';
    booking.updatedAt = new Date().toISOString();
    booking.statusHistory.push({
      status: 'pending-admin',
      timestamp: new Date().toISOString(),
      updatedBy: 'Client',
      notes: 'Booking submitted for admin review'
    });

    this.notify();
    return true;
  }

  // Step 3: Admin provides final quote
  adminProvideQuote(bookingId: string, finalPrice: number, adminNotes?: string): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking || booking.status !== 'pending-admin') return false;

    booking.quote.finalPrice = finalPrice;
    booking.quote.adminNotes = adminNotes;
    booking.quote.updatedAt = new Date().toISOString();
    booking.status = 'admin-quoted';
    booking.updatedAt = new Date().toISOString();
    booking.statusHistory.push({
      status: 'admin-quoted',
      timestamp: new Date().toISOString(),
      updatedBy: 'Admin',
      notes: `Final quote provided: $${finalPrice}${adminNotes ? ` - ${adminNotes}` : ''}`
    });

    this.notify();
    return true;
  }

  // Step 4: Client approves final quote
  clientApproveQuote(bookingId: string): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking || booking.status !== 'admin-quoted') return false;

    booking.status = 'client-approved';
    booking.updatedAt = new Date().toISOString();
    booking.statusHistory.push({
      status: 'client-approved',
      timestamp: new Date().toISOString(),
      updatedBy: 'Client',
      notes: 'Client approved final quote'
    });

    this.notify();
    return true;
  }

  // Step 5: Process payment
  processPayment(bookingId: string, paymentData: {
    amount: number;
    method: 'card' | 'apple-pay' | 'google-pay' | 'paypal';
    type: 'initial' | 'final';
  }): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking) return false;

    const payment: BookingPayment = {
      id: `PAY-${Date.now()}`,
      bookingId,
      amount: paymentData.amount,
      type: paymentData.type,
      status: 'processing',
      method: paymentData.method
    };

    booking.payments.push(payment);
    booking.status = 'payment-pending';
    booking.updatedAt = new Date().toISOString();

    // Simulate payment processing
    setTimeout(() => {
      payment.status = 'success';
      payment.paidAt = new Date().toISOString();
      payment.transactionId = `TXN-${Date.now()}`;
      
      if (paymentData.type === 'initial') {
        booking.status = 'booking-confirmed';
        booking.statusHistory.push({
          status: 'booking-confirmed',
          timestamp: new Date().toISOString(),
          updatedBy: 'System',
          notes: `Initial payment of $${paymentData.amount} processed successfully`
        });
      } else {
        booking.status = 'completed';
        booking.statusHistory.push({
          status: 'completed',
          timestamp: new Date().toISOString(),
          updatedBy: 'System',
          notes: `Final payment of $${paymentData.amount} processed successfully`
        });
      }
      
      this.notify();
    }, 2000);

    this.notify();
    return true;
  }

  // Step 6: Assign crew
  assignCrew(bookingId: string, crewIds: string[]): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking || booking.status !== 'booking-confirmed') return false;

    booking.assignedCrewIds = crewIds;
    booking.assignedAt = new Date().toISOString();
    booking.status = 'crew-assigned';
    booking.updatedAt = new Date().toISOString();
    booking.statusHistory.push({
      status: 'crew-assigned',
      timestamp: new Date().toISOString(),
      updatedBy: 'Admin',
      notes: `Crew assigned: ${crewIds.join(', ')}`
    });

    this.notify();
    return true;
  }

  // Step 7: Start work
  startWork(bookingId: string): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking || booking.status !== 'crew-assigned') return false;

    booking.workStartedAt = new Date().toISOString();
    booking.status = 'in-progress';
    booking.updatedAt = new Date().toISOString();
    booking.statusHistory.push({
      status: 'in-progress',
      timestamp: new Date().toISOString(),
      updatedBy: 'Crew',
      notes: 'Work started'
    });

    this.notify();
    return true;
  }

  // Step 8: Complete work
  completeWork(bookingId: string): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking || booking.status !== 'in-progress') return false;

    booking.workCompletedAt = new Date().toISOString();
    booking.status = 'work-completed';
    booking.updatedAt = new Date().toISOString();
    booking.statusHistory.push({
      status: 'work-completed',
      timestamp: new Date().toISOString(),
      updatedBy: 'Crew',
      notes: 'Work completed'
    });

    this.notify();
    return true;
  }

  // Step 9: Admin review work and set final amount
  adminReviewWork(bookingId: string, finalAmount: number, adminNotes?: string): boolean {
    const booking = this.getBookingById(bookingId);
    if (!booking || booking.status !== 'work-completed') return false;

    booking.finalAmount = finalAmount;
    booking.adminReviewedAt = new Date().toISOString();
    booking.adminReviewedBy = 'Admin';
    booking.adminNotes = adminNotes;
    booking.status = 'admin-reviewed';
    booking.updatedAt = new Date().toISOString();
    booking.statusHistory.push({
      status: 'admin-reviewed',
      timestamp: new Date().toISOString(),
      updatedBy: 'Admin',
      notes: `Work reviewed. Final amount: $${finalAmount}${adminNotes ? ` - ${adminNotes}` : ''}`
    });

    // If final amount requires additional payment
    const totalPaid = booking.payments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0);

    if (finalAmount > totalPaid) {
      booking.status = 'final-payment-pending';
      booking.statusHistory.push({
        status: 'final-payment-pending',
        timestamp: new Date().toISOString(),
        updatedBy: 'System',
        notes: `Additional payment required: $${finalAmount - totalPaid}`
      });
    } else {
      booking.status = 'completed';
      booking.statusHistory.push({
        status: 'completed',
        timestamp: new Date().toISOString(),
        updatedBy: 'System',
        notes: 'Booking completed successfully'
      });
    }

    this.notify();
    return true;
  }

  // Helper methods
  getBookings(): Booking[] {
    return [...this.bookings];
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }

  getBookingsByStatus(status: BookingStatus): Booking[] {
    return this.bookings.filter(b => b.status === status);
  }

  private calculateEstimatedPrice(data: any): number {
    let basePrice = 200;
    
    if (data.urgency === 'emergency') basePrice *= 1.5;
    if (data.serviceType.includes('hoarder')) basePrice *= 2;
    if (data.serviceType.includes('fire') || data.serviceType.includes('flood')) basePrice *= 1.8;
    
    return Math.round(basePrice);
  }

  private generatePriceBreakdown(data: any, totalPrice: number): PriceBreakdown[] {
    const breakdown: PriceBreakdown[] = [
      {
        id: '1',
        description: 'Base Service',
        quantity: 1,
        unitPrice: 200,
        total: 200,
        category: 'base'
      }
    ];

    if (data.urgency === 'emergency') {
      breakdown.push({
        id: '2',
        description: 'Emergency Premium',
        quantity: 1,
        unitPrice: 100,
        total: 100,
        category: 'premium'
      });
    }

    return breakdown;
  }
}

export const bookingStore = new BookingStore();