// Web Worker for heavy computations
self.onmessage = function(e) {
  const { type, data } = e.data;

  switch (type) {
    case 'PROCESS_BOOKINGS':
      processBookings(data);
      break;
    case 'CALCULATE_ANALYTICS':
      calculateAnalytics(data);
      break;
    case 'FILTER_LARGE_DATASET':
      filterLargeDataset(data);
      break;
    case 'SORT_BOOKINGS':
      sortBookings(data);
      break;
    default:
      self.postMessage({ error: 'Unknown task type' });
  }
};

function processBookings(bookings) {
  try {
    const processed = bookings.map(booking => ({
      ...booking,
      totalAmount: calculateTotalAmount(booking),
      daysUntilScheduled: calculateDaysUntil(booking.scheduledDate),
      priority: calculatePriority(booking)
    }));

    self.postMessage({
      type: 'PROCESS_BOOKINGS_COMPLETE',
      data: processed
    });
  } catch (error) {
    self.postMessage({
      type: 'PROCESS_BOOKINGS_ERROR',
      error: error.message
    });
  }
}

function calculateAnalytics(bookings) {
  try {
    const analytics = {
      totalBookings: bookings.length,
      statusBreakdown: {},
      revenueByMonth: {},
      averageJobValue: 0,
      completionRate: 0,
      topClients: []
    };

    // Status breakdown
    bookings.forEach(booking => {
      analytics.statusBreakdown[booking.status] = 
        (analytics.statusBreakdown[booking.status] || 0) + 1;
    });

    // Revenue by month
    bookings.forEach(booking => {
      if (booking.finalAmount) {
        const month = booking.scheduledDate.substring(0, 7);
        analytics.revenueByMonth[month] = 
          (analytics.revenueByMonth[month] || 0) + booking.finalAmount;
      }
    });

    // Average job value
    const completedBookings = bookings.filter(b => b.status === 'completed');
    if (completedBookings.length > 0) {
      analytics.averageJobValue = completedBookings.reduce(
        (sum, b) => sum + (b.finalAmount || 0), 0
      ) / completedBookings.length;
    }

    // Completion rate
    analytics.completionRate = completedBookings.length / bookings.length;

    // Top clients
    const clientRevenue = {};
    bookings.forEach(booking => {
      if (booking.finalAmount) {
        clientRevenue[booking.clientId] = 
          (clientRevenue[booking.clientId] || 0) + booking.finalAmount;
      }
    });

    analytics.topClients = Object.entries(clientRevenue)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([clientId, revenue]) => ({ clientId, revenue }));

    self.postMessage({
      type: 'CALCULATE_ANALYTICS_COMPLETE',
      data: analytics
    });
  } catch (error) {
    self.postMessage({
      type: 'CALCULATE_ANALYTICS_ERROR',
      error: error.message
    });
  }
}

function filterLargeDataset({ bookings, filters }) {
  try {
    let filtered = bookings;

    if (filters.status) {
      filtered = filtered.filter(b => b.status === filters.status);
    }

    if (filters.clientId) {
      filtered = filtered.filter(b => b.clientId === filters.clientId);
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(b => {
        const date = new Date(b.scheduledDate);
        return date >= new Date(start) && date <= new Date(end);
      });
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(b => 
        b.clientName.toLowerCase().includes(searchLower) ||
        b.propertyAddress.toLowerCase().includes(searchLower) ||
        b.serviceType.toLowerCase().includes(searchLower)
      );
    }

    if (filters.minAmount || filters.maxAmount) {
      filtered = filtered.filter(b => {
        const amount = b.finalAmount || b.quote?.estimatedPrice || 0;
        return (!filters.minAmount || amount >= filters.minAmount) &&
               (!filters.maxAmount || amount <= filters.maxAmount);
      });
    }

    self.postMessage({
      type: 'FILTER_LARGE_DATASET_COMPLETE',
      data: filtered
    });
  } catch (error) {
    self.postMessage({
      type: 'FILTER_LARGE_DATASET_ERROR',
      error: error.message
    });
  }
}

function sortBookings({ bookings, sortBy, sortOrder }) {
  try {
    const sorted = [...bookings].sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'date':
          aVal = new Date(a.scheduledDate);
          bVal = new Date(b.scheduledDate);
          break;
        case 'amount':
          aVal = a.finalAmount || a.quote?.estimatedPrice || 0;
          bVal = b.finalAmount || b.quote?.estimatedPrice || 0;
          break;
        case 'client':
          aVal = a.clientName.toLowerCase();
          bVal = b.clientName.toLowerCase();
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = a.createdAt;
          bVal = b.createdAt;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    self.postMessage({
      type: 'SORT_BOOKINGS_COMPLETE',
      data: sorted
    });
  } catch (error) {
    self.postMessage({
      type: 'SORT_BOOKINGS_ERROR',
      error: error.message
    });
  }
}

// Helper functions
function calculateTotalAmount(booking) {
  return booking.finalAmount || booking.quote?.estimatedPrice || 0;
}

function calculateDaysUntil(dateString) {
  const scheduledDate = new Date(dateString);
  const today = new Date();
  const diffTime = scheduledDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculatePriority(booking) {
  let priority = 0;
  
  if (booking.urgency === 'emergency') priority += 10;
  if (booking.status === 'pending-admin') priority += 5;
  if (booking.status === 'client-approved') priority += 8;
  
  const daysUntil = calculateDaysUntil(booking.scheduledDate);
  if (daysUntil <= 1) priority += 7;
  else if (daysUntil <= 3) priority += 5;
  else if (daysUntil <= 7) priority += 3;
  
  return priority;
}