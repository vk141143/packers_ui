import { Booking, BookingStatus } from '../types/booking';

interface IndexedBookings {
  byId: Map<string, Booking>;
  byStatus: Map<BookingStatus, Set<string>>;
  byClient: Map<string, Set<string>>;
  byDate: Map<string, Set<string>>;
  all: string[];
}

class OptimizedBookingStore {
  private data: IndexedBookings = {
    byId: new Map(),
    byStatus: new Map(),
    byClient: new Map(),
    byDate: new Map(),
    all: []
  };
  
  private listeners = new Set<() => void>();
  private batchTimeout: NodeJS.Timeout | null = null;
  private pendingUpdates = new Set<string>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private batchNotify() {
    if (this.batchTimeout) return;
    
    this.batchTimeout = setTimeout(() => {
      this.listeners.forEach(listener => listener());
      this.batchTimeout = null;
      this.pendingUpdates.clear();
    }, 16); // ~60fps
  }

  addBooking(booking: Booking) {
    this.data.byId.set(booking.id, booking);
    this.addToIndex(booking);
    this.data.all.unshift(booking.id);
    this.batchNotify();
  }

  updateBooking(id: string, updates: Partial<Booking>) {
    const existing = this.data.byId.get(id);
    if (!existing) return false;

    this.removeFromIndex(existing);
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.data.byId.set(id, updated);
    this.addToIndex(updated);
    this.batchNotify();
    return true;
  }

  private addToIndex(booking: Booking) {
    // Status index
    if (!this.data.byStatus.has(booking.status)) {
      this.data.byStatus.set(booking.status, new Set());
    }
    this.data.byStatus.get(booking.status)!.add(booking.id);

    // Client index
    if (!this.data.byClient.has(booking.clientId)) {
      this.data.byClient.set(booking.clientId, new Set());
    }
    this.data.byClient.get(booking.clientId)!.add(booking.id);

    // Date index
    const dateKey = booking.scheduledDate.split('T')[0];
    if (!this.data.byDate.has(dateKey)) {
      this.data.byDate.set(dateKey, new Set());
    }
    this.data.byDate.get(dateKey)!.add(booking.id);
  }

  private removeFromIndex(booking: Booking) {
    this.data.byStatus.get(booking.status)?.delete(booking.id);
    this.data.byClient.get(booking.clientId)?.delete(booking.id);
    const dateKey = booking.scheduledDate.split('T')[0];
    this.data.byDate.get(dateKey)?.delete(booking.id);
  }

  // Optimized queries
  getBookingById(id: string): Booking | undefined {
    return this.data.byId.get(id);
  }

  getBookingsByStatus(status: BookingStatus, limit = 100): Booking[] {
    const ids = Array.from(this.data.byStatus.get(status) || []).slice(0, limit);
    return ids.map(id => this.data.byId.get(id)!).filter(Boolean);
  }

  getBookingsByClient(clientId: string, limit = 100): Booking[] {
    const ids = Array.from(this.data.byClient.get(clientId) || []).slice(0, limit);
    return ids.map(id => this.data.byId.get(id)!).filter(Boolean);
  }

  getBookingsByDateRange(startDate: string, endDate: string, limit = 100): Booking[] {
    const results: Booking[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (const [dateKey, ids] of this.data.byDate) {
      const date = new Date(dateKey);
      if (date >= start && date <= end) {
        for (const id of ids) {
          if (results.length >= limit) break;
          const booking = this.data.byId.get(id);
          if (booking) results.push(booking);
        }
      }
      if (results.length >= limit) break;
    }
    
    return results;
  }

  // Paginated queries for large datasets
  getPaginatedBookings(page = 0, pageSize = 50): { bookings: Booking[]; total: number } {
    const start = page * pageSize;
    const end = start + pageSize;
    const ids = this.data.all.slice(start, end);
    const bookings = ids.map(id => this.data.byId.get(id)!).filter(Boolean);
    
    return {
      bookings,
      total: this.data.all.length
    };
  }

  // Bulk operations for efficiency
  bulkAddBookings(bookings: Booking[]) {
    bookings.forEach(booking => {
      this.data.byId.set(booking.id, booking);
      this.addToIndex(booking);
      this.data.all.unshift(booking.id);
    });
    this.batchNotify();
  }

  // Memory management
  cleanup(olderThanDays = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);
    
    const toRemove: string[] = [];
    for (const [id, booking] of this.data.byId) {
      if (new Date(booking.createdAt) < cutoff && booking.status === 'completed') {
        toRemove.push(id);
      }
    }
    
    toRemove.forEach(id => {
      const booking = this.data.byId.get(id);
      if (booking) {
        this.removeFromIndex(booking);
        this.data.byId.delete(id);
        const index = this.data.all.indexOf(id);
        if (index > -1) this.data.all.splice(index, 1);
      }
    });
    
    if (toRemove.length > 0) this.batchNotify();
    return toRemove.length;
  }

  getStats() {
    return {
      total: this.data.all.length,
      byStatus: Object.fromEntries(
        Array.from(this.data.byStatus.entries()).map(([status, ids]) => [status, ids.size])
      ),
      memoryUsage: {
        bookings: this.data.byId.size,
        statusIndex: this.data.byStatus.size,
        clientIndex: this.data.byClient.size,
        dateIndex: this.data.byDate.size
      }
    };
  }
}

export const optimizedBookingStore = new OptimizedBookingStore();