// Mock API - No external integrations

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
  return { success: true, data: { id: Date.now().toString(), ...payload } };
};

export const createJobDraft = async (payload: any): Promise<ApiResponse<any>> => {
  return { success: true, data: { id: Date.now().toString(), ...payload } };
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
  
  const response = await fetch('https://client.voidworksgroup.co.uk/api/client/history', {
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
  
  try {
    const response = await fetch(`https://client.voidworksgroup.co.uk/api/client/tracking/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 404) {
      // Return mock data for non-existent jobs
      return {
        success: true,
        data: {
          job_id: jobId,
          status: 'pending',
          crew_assigned: false,
          tracking_updates: [],
          message: 'Job tracking not available yet'
        }
      };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch job tracking details`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.warn('Job tracking API error:', error);
    // Return fallback data instead of throwing
    return {
      success: true,
      data: {
        job_id: jobId,
        status: 'pending',
        crew_assigned: false,
        tracking_updates: [],
        message: 'Job tracking temporarily unavailable'
      }
    };
  }
};

export const getJobTracking = async (): Promise<ApiResponse<any[]>> => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token || token.startsWith('mock_token')) {
      return { success: true, data: [] };
    }
    
    const response = await fetch('https://client.voidworksgroup.co.uk/api/client/tracking', {
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
  } catch (error) {
    console.error('Job tracking fetch error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const assignCrew = async (bookingId: string): Promise<ApiResponse<any>> => {
  return { success: true, data: { bookingId, crewAssigned: true } };
};

export const getAssignedCrew = async (): Promise<ApiResponse<any>> => {
  return { success: true, data: [] };
};

export const getClientInvoices = async (): Promise<ApiResponse<any>> => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token || token.startsWith('mock_token')) {
      return {
        success: true,
        data: {
          total_invoices: 0,
          invoices: []
        }
      };
    }
    
    const response = await fetch('https://client.voidworksgroup.co.uk/api/client/invoices', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      return { success: true, data: { total_invoices: 0, invoices: [] } };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch invoices`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Client invoices fetch error:', error);
    return { success: true, data: { total_invoices: 0, invoices: [] } };
  }
};

export const downloadClientInvoice = async (invoiceId: string): Promise<ApiResponse<any>> => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token || token.startsWith('mock_token')) {
      throw new Error('Invoice not found in demo mode');
    }
    
    const response = await fetch(`https://client.voidworksgroup.co.uk/api/client/invoices/${invoiceId}/download`, {
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
  } catch (error) {
    console.error('Invoice download error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Download failed' };
  }
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
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token || token.startsWith('mock_token')) {
      return {
        success: true,
        data: {
          message: 'Quote approved successfully',
          job_id: quoteId,
          status: 'quote_accepted'
        }
      };
    }
    
    const response = await fetch(`https://client.voidworksgroup.co.uk/api/client/quotes/${quoteId}/approve`, {
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
  } catch (error) {
    console.error('Quote approval error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const rejectClientQuote = async (quoteId: string, reason: string): Promise<ApiResponse<any>> => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token || token.startsWith('mock_token')) {
      return {
        success: true,
        data: {
          message: 'Quote rejected successfully',
          job_id: quoteId,
          status: 'quote_rejected'
        }
      };
    }
    
    const response = await fetch(`https://client.voidworksgroup.co.uk/api/client/quotes/${quoteId}/decline`, {
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
  } catch (error) {
    console.error('Quote rejection error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
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
  
  const response = await fetch('https://hammerhead-app-du23o.ondigitalocean.app/api/admin/dashboard/active-jobs', {
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
    const response = await fetch('https://client.voidworksgroup.co.uk/api/client/quotes', {
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
