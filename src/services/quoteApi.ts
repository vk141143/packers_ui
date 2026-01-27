// API service for the proper workflow implementation
// This demonstrates the required backend endpoints

export interface AIEstimate {
  estimated_van_loads: number;
  risk_flags: string[];
  suggested_price_range: {
    min: number;
    max: number;
  };
  property_analysis: {
    size_assessment: string;
    access_difficulty: 'easy' | 'moderate' | 'difficult';
    waste_classification: string;
  };
}

export interface QuoteRequest {
  service_type: string;
  property_address: string;
  property_size: string;
  waste_type: string;
  access_conditions: string;
  photos: File[];
  scheduled_date: string;
  sla_type: string;
  notes: string;
}

export interface ApprovedQuote {
  id: string;
  service_price: number;
  risk_buffer: number;
  vat: number;
  final_price: number;
  deposit_required: boolean;
  deposit_amount: number;
  deposit_paid: boolean;
  scope_of_work: string;
  completion_timeline: string;
  cancellation_terms: string;
  ops_notes: string;
  approved_by: string;
  approved_at: string;
}

export interface QuoteStatus {
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  quote?: ApprovedQuote;
  rejection_reason?: string;
  estimated_completion?: string;
}

// Step 1: Submit for AI analysis and ops review
export const submitQuoteRequest = async (request: QuoteRequest): Promise<{
  success: boolean;
  quote_id?: string;
  error?: string;
}> => {
  try {
    const formData = new FormData();
    
    // Add form fields
    Object.entries(request).forEach(([key, value]) => {
      if (key === 'photos') {
        value.forEach((photo: File) => formData.append('photos', photo));
      } else {
        formData.append(key, value);
      }
    });

    const response = await fetch('/api/quotes/submit-for-review', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, quote_id: data.quote_id };
    } else {
      return { success: false, error: data.error || 'Failed to submit quote request' };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// Step 2: Check quote status (polling)
export const getQuoteStatus = async (quoteId?: string): Promise<{
  success: boolean;
  data?: QuoteStatus;
  error?: string;
}> => {
  try {
    const url = quoteId ? `/api/quotes/${quoteId}/status` : '/api/quotes/status';
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.error || 'Failed to get quote status' };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// Step 3: Accept quote (triggers deposit collection if required)
export const acceptQuote = async (quoteId: string): Promise<{
  success: boolean;
  deposit_payment_url?: string;
  error?: string;
}> => {
  try {
    const response = await fetch(`/api/quotes/${quoteId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    
    if (response.ok) {
      return { 
        success: true, 
        deposit_payment_url: data.deposit_payment_url 
      };
    } else {
      return { success: false, error: data.error || 'Failed to accept quote' };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// Step 4: Process deposit payment
export const processDeposit = async (quoteId: string, paymentDetails: any): Promise<{
  success: boolean;
  payment_id?: string;
  error?: string;
}> => {
  try {
    const response = await fetch(`/api/quotes/${quoteId}/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentDetails),
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, payment_id: data.payment_id };
    } else {
      return { success: false, error: data.error || 'Payment failed' };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// Step 5: Create job after deposit confirmation
export const createJobFromQuote = async (quoteId: string): Promise<{
  success: boolean;
  job_id?: string;
  error?: string;
}> => {
  try {
    const response = await fetch(`/api/quotes/${quoteId}/create-job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, job_id: data.job_id };
    } else {
      return { success: false, error: data.error || 'Failed to create job' };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

/* 
Backend Implementation Notes:

1. AI Analysis Endpoint (/api/quotes/submit-for-review):
   - Receives client request with photos and details
   - Runs AI analysis on photos and property details
   - Generates internal estimate (van loads, risk flags, price range)
   - Creates quote record with status 'under_review'
   - Notifies operations team
   - Returns quote_id to client

2. Operations Review Process:
   - Ops team reviews AI estimate and photos
   - Can adjust pricing, add risk buffers
   - Can require site visit or change waste classification
   - Sets final price, deposit requirement, scope
   - Updates quote status to 'approved' or 'rejected'

3. Quote Status Endpoint (/api/quotes/status):
   - Returns current status and approved quote details
   - Only shows final pricing after ops approval
   - Never exposes AI estimates to client

4. Deposit Collection:
   - If deposit required, generates payment link
   - Job remains locked until deposit confirmed
   - Integrates with payment processor

5. Job Creation:
   - Only creates job after quote acceptance and deposit (if required)
   - Assigns crew and generates dispatch
   - Sends confirmation to client

This ensures:
- ❌ Client never sees AI pricing
- ✅ Mandatory ops review gate
- ✅ Proper deposit collection flow
- ✅ Job only created after all approvals
*/