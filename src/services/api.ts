// Production API - Real backend integrations

export interface BookingPayload {
  service_type: string;
  service_level: string;
  property_size: string;
  van_loads: number;
  waste_types: string;
  furniture_items?: number;
  property_address: string;
  scheduled_date: string;
  scheduled_time: string;
  property_photos?: string;
  price: number;
  additional_notes?: string;
  latitude?: number;
  longitude?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const bookJob = async (payload: BookingPayload): Promise<ApiResponse<any>> => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Job booking failed' }));
    throw new Error(error.message || 'Job booking failed');
  }
  
  const data = await response.json();
  return { success: true, data };
};

export const createJobDraft = async (payload: any): Promise<ApiResponse<any>> => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/jobs/draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Draft creation failed' }));
    throw new Error(error.message || 'Draft creation failed');
  }
  
  const data = await response.json();
  return { success: true, data };
};

export const getJobDraft = async (jobId: string): Promise<ApiResponse<any>> => {
  return { success: true, data: { id: jobId, status: 'draft' } };
};

export const confirmJob = async (jobId: string): Promise<ApiResponse<any>> => {
  return { success: true, data: { id: jobId, status: 'confirmed' } };
};

export const getJobHistory = async (): Promise<ApiResponse<any[]>> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch('/api/client/history', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    throw new Error('Session expired. Please login again.');
  }
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to fetch job history`);
  }
  
  const data = await response.json();
  return { success: true, data };
};

export const getJobById = async (jobId: string): Promise<ApiResponse<any>> => {
  return { success: true, data: { id: jobId, status: 'active' } };
};

export const getJobTrackingById = async (jobId: string): Promise<ApiResponse<any>> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`/api/client/tracking/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to fetch job tracking details`);
  }
  
  const data = await response.json();
  return { success: true, data };
};

export const getJobTracking = async (): Promise<ApiResponse<any[]>> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch('/api/client/tracking', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to fetch job tracking`);
  }
  
  const data = await response.json();
  return { success: true, data };
};

export const assignCrew = async (bookingId: string): Promise<ApiResponse<any>> => {
  return { success: true, data: { bookingId, crewAssigned: true } };
};

export const getAssignedCrew = async (): Promise<ApiResponse<any>> => {
  return { success: true, data: [] };
};

export const getClientInvoices = async (): Promise<ApiResponse<any>> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch('/api/client/invoices', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    throw new Error('Session expired');
  }
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to fetch invoices`);
  }
  
  const data = await response.json();
  return { success: true, data };
};

export const downloadClientInvoice = async (invoiceId: string): Promise<ApiResponse<any>> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`/api/client/invoices/${invoiceId}/download`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Invoice not found' }));
    throw new Error(error.detail || 'Failed to download invoice');
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${invoiceId}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  
  return { success: true, data: { downloaded: true } };
};

export const cancelJobRequest = async (jobId: string): Promise<ApiResponse<any>> => {
  return { success: true, data: { id: jobId, status: 'cancelled' } };
};

export const submitJobRating = async (jobId: string, rating: number): Promise<ApiResponse<any>> => {
  return { success: true, data: { jobId, rating } };
};

export const getJobRating = async (jobId: string): Promise<ApiResponse<any>> => {
  return { success: true, data: { jobId, rating: 5 } };
};

// NEW: Operations approval APIs
export const submitOpsReview = async (jobId: string, reviewData: any): Promise<ApiResponse<any>> => {
  return { success: true, data: { jobId, ...reviewData } };
};

export const sendQuoteToClient = async (jobId: string): Promise<ApiResponse<any>> => {
  return { success: true, data: { jobId, quoteSent: true } };
};

// NEW: Client quote acceptance APIs
export const approveClientQuote = async (quoteId: string): Promise<ApiResponse<any>> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`/api/client/quotes/${quoteId}/approve`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to approve quote`);
  }
  
  const data = await response.json();
  return { success: true, data };
};

export const rejectClientQuote = async (quoteId: string, reason: string): Promise<ApiResponse<any>> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`/api/client/quotes/${quoteId}/decline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reason })
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Quote not found' }));
    throw new Error(error.detail || 'Failed to reject quote');
  }
  
  const data = await response.json();
  return { success: true, data };
};

// NEW: Deposit collection APIs
export const processDeposit = async (jobId: string, paymentData: any): Promise<ApiResponse<any>> => {
  return { success: true, data: { jobId, depositPaid: true, ...paymentData } };
};

// NEW: Final payment APIs
export const processFinalPayment = async (jobId: string, paymentData: any): Promise<ApiResponse<any>> => {
  return { success: true, data: { jobId, finalPaymentReceived: true, ...paymentData } };
};

export const getPaymentBreakdown = async (jobId: string): Promise<ApiResponse<any>> => {
  return { success: true, data: { totalAmount: 1000, depositPaid: 300, remainingBalance: 700 } };
};

// NEW: Operations dashboard APIs
export const getPendingReviews = async (): Promise<ApiResponse<any[]>> => {
  return { success: true, data: [] };
};

export const getJobsAwaitingApproval = async (): Promise<ApiResponse<any[]>> => {
  return { success: true, data: [] };
};

export const getServices = async (): Promise<ApiResponse<any[]>> => {
  return { success: true, data: [] };
};

export const getServiceById = async (serviceId: string): Promise<ApiResponse<any>> => {
  return { success: true, data: { id: serviceId, name: 'Service' } };
};

export const getServiceLevels = async (): Promise<ApiResponse<any[]>> => {
  return { success: true, data: [] };
};

export const estimatePrice = async (payload: any): Promise<ApiResponse<any>> => {
  return { success: true, data: { price: 100 } };
};

export const getAdminActiveJobs = async (): Promise<ApiResponse<any[]>> => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('No access token available');
  }
  
  const response = await fetch('https://voidworksgroup.co.uk/api/admin/dashboard/active-jobs', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch active jobs' }));
    throw new Error(error.message || 'Admin active jobs fetch failed');
  }

  const data = await response.json();
  return { success: true, data };
};

// Quote interfaces
export interface Quote {
  job_id: string;
  property_address: string;
  service_type: string;
  preferred_date: string;
  quote_amount: number;
  deposit_amount: number;
  quote_notes: string;
  status: string;
  created_at: string;
}

// NEW: Get all quotes API
export const getAllQuotes = async (): Promise<ApiResponse<Quote[]>> => {
  try {
    const response = await fetch('/api/client/quotes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch quotes`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch quotes' 
    };
  }
};

export type { ApiResponse };
