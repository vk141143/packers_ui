// Backend API Implementation for Proper Workflow
// This should be deployed to your backend server

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use(cors({
  origin: ['https://ui-packers-y8cjd.ondigitalocean.app', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// In-memory storage (replace with database)
let quotes = [];
let jobs = [];

// STEP 1: AI Analysis & Operations Review
app.post('/api/quotes/submit-for-review', upload.array('photos', 10), async (req, res) => {
  try {
    const {
      service_type,
      property_address,
      property_size,
      waste_type,
      access_conditions,
      scheduled_date,
      sla_type,
      notes
    } = req.body;

    // Generate AI estimate (internal only)
    const aiEstimate = {
      estimated_van_loads: Math.ceil(Math.random() * 3) + 1,
      risk_flags: generateRiskFlags(waste_type, access_conditions),
      suggested_price_range: {
        min: calculateBasePrice(property_size) * 0.8,
        max: calculateBasePrice(property_size) * 1.2
      },
      property_analysis: {
        size_assessment: property_size,
        access_difficulty: assessAccessDifficulty(access_conditions),
        waste_classification: waste_type
      }
    };

    const quote = {
      id: `QT-${Date.now()}`,
      service_type,
      property_address,
      property_size,
      waste_type,
      access_conditions,
      scheduled_date,
      sla_type,
      notes,
      photos: req.files?.map(f => f.filename) || [],
      ai_estimate: aiEstimate, // INTERNAL ONLY
      status: 'under_review',
      created_at: new Date().toISOString(),
      ops_reviewed: false
    };

    quotes.push(quote);

    // Notify operations team (implement your notification system)
    notifyOpsTeam(quote);

    res.json({
      success: true,
      quote_id: quote.id,
      message: 'Quote request submitted for operations review'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process quote request'
    });
  }
});

// STEP 2: Operations Team Review & Approval
app.post('/api/quotes/:quoteId/ops-review', (req, res) => {
  try {
    const { quoteId } = req.params;
    const {
      final_price,
      deposit_required,
      deposit_amount,
      scope_of_work,
      completion_timeline,
      ops_notes,
      approved_by
    } = req.body;

    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    // Update quote with operations approval
    quote.status = 'approved';
    quote.ops_reviewed = true;
    quote.final_quote = {
      service_price: final_price,
      deposit_required,
      deposit_amount: deposit_required ? deposit_amount : 0,
      scope_of_work,
      completion_timeline,
      cancellation_terms: 'Standard 24h cancellation policy applies',
      ops_notes,
      approved_by,
      approved_at: new Date().toISOString()
    };

    // Send quote to client (implement your notification system)
    sendQuoteToClient(quote);

    res.json({
      success: true,
      message: 'Quote approved and sent to client'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process operations review'
    });
  }
});

// STEP 3: Client Quote Status Check
app.get('/api/quotes/:quoteId/status', (req, res) => {
  try {
    const { quoteId } = req.params;
    const quote = quotes.find(q => q.id === quoteId);
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    // Only return client-facing information
    const response = {
      status: quote.status,
      quote_id: quote.id
    };

    // Only include final quote if approved
    if (quote.status === 'approved' && quote.final_quote) {
      response.quote = {
        final_price: quote.final_quote.service_price,
        deposit_required: quote.final_quote.deposit_required,
        deposit_amount: quote.final_quote.deposit_amount,
        scope_of_work: quote.final_quote.scope_of_work,
        completion_timeline: quote.final_quote.completion_timeline,
        cancellation_terms: quote.final_quote.cancellation_terms
      };
    }

    res.json(response);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get quote status'
    });
  }
});

// STEP 4: Client Quote Acceptance
app.post('/api/quotes/:quoteId/accept', (req, res) => {
  try {
    const { quoteId } = req.params;
    const quote = quotes.find(q => q.id === quoteId);
    
    if (!quote || quote.status !== 'approved') {
      return res.status(400).json({ error: 'Quote not available for acceptance' });
    }

    quote.status = 'client_accepted';
    quote.accepted_at = new Date().toISOString();

    const response = { success: true };

    // If deposit required, provide payment URL
    if (quote.final_quote.deposit_required) {
      quote.status = 'deposit_pending';
      response.deposit_payment_url = `/payment/deposit/${quoteId}`;
    } else {
      // No deposit required, proceed to job creation
      const job = createJobFromQuote(quote);
      response.job_id = job.id;
    }

    res.json(response);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to accept quote'
    });
  }
});

// STEP 5: Deposit Payment Processing
app.post('/api/quotes/:quoteId/deposit', (req, res) => {
  try {
    const { quoteId } = req.params;
    const { payment_method, card_details } = req.body;
    
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote || quote.status !== 'deposit_pending') {
      return res.status(400).json({ error: 'Deposit payment not available' });
    }

    // Process payment (integrate with your payment processor)
    const paymentResult = processPayment({
      amount: quote.final_quote.deposit_amount,
      method: payment_method,
      card_details
    });

    if (paymentResult.success) {
      quote.status = 'deposit_paid';
      quote.deposit_payment = {
        amount: quote.final_quote.deposit_amount,
        paid_at: new Date().toISOString(),
        transaction_id: paymentResult.transaction_id,
        method: payment_method
      };

      // Create job after deposit confirmation
      const job = createJobFromQuote(quote);

      res.json({
        success: true,
        payment_id: paymentResult.transaction_id,
        job_id: job.id
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment failed'
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Payment processing failed'
    });
  }
});

// STEP 6: Job Creation & Scheduling
function createJobFromQuote(quote) {
  const job = {
    id: `JOB-${Date.now()}`,
    quote_id: quote.id,
    status: 'scheduled',
    property_address: quote.property_address,
    scheduled_date: quote.scheduled_date,
    service_type: quote.service_type,
    final_price: quote.final_quote.service_price,
    deposit_paid: quote.deposit_payment?.amount || 0,
    remaining_balance: quote.final_quote.service_price - (quote.deposit_payment?.amount || 0),
    crew_assigned: null,
    created_at: new Date().toISOString()
  };

  jobs.push(job);
  
  // Assign crew and send dispatch
  assignCrewAndDispatch(job);
  
  return job;
}

// STEP 7: Job Execution
app.post('/api/jobs/:jobId/complete', upload.array('completion_photos', 10), (req, res) => {
  try {
    const { jobId } = req.params;
    const { crew_notes } = req.body;
    
    const job = jobs.find(j => j.id === jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    job.status = 'completed';
    job.completion = {
      completed_at: new Date().toISOString(),
      crew_notes,
      completion_photos: req.files?.map(f => f.filename) || []
    };

    // Notify operations for verification
    notifyOpsForVerification(job);

    res.json({
      success: true,
      message: 'Job marked as completed, pending verification'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to complete job'
    });
  }
});

// STEP 8: Verification & Final Invoice
app.post('/api/jobs/:jobId/verify', (req, res) => {
  try {
    const { jobId } = req.params;
    const { verified_by, verification_notes } = req.body;
    
    const job = jobs.find(j => j.id === jobId);
    if (!job || job.status !== 'completed') {
      return res.status(400).json({ error: 'Job not available for verification' });
    }

    job.status = 'verified';
    job.verification = {
      verified_at: new Date().toISOString(),
      verified_by,
      verification_notes
    };

    // Generate final invoice
    const invoice = generateFinalInvoice(job);
    
    res.json({
      success: true,
      invoice_id: invoice.id,
      remaining_balance: job.remaining_balance
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to verify job'
    });
  }
});

// Helper Functions
function generateRiskFlags(wasteType, accessConditions) {
  const flags = [];
  if (wasteType === 'hazardous') flags.push('hazardous_materials');
  if (accessConditions?.toLowerCase().includes('stairs')) flags.push('difficult_access');
  if (accessConditions?.toLowerCase().includes('narrow')) flags.push('access_restrictions');
  return flags;
}

function calculateBasePrice(propertySize) {
  const prices = {
    'studio': 200,
    '1bed': 300,
    '2bed': 450,
    '3bed': 600,
    '4bed': 800
  };
  return prices[propertySize] || 400;
}

function assessAccessDifficulty(accessConditions) {
  if (!accessConditions) return 'easy';
  const conditions = accessConditions.toLowerCase();
  if (conditions.includes('stairs') || conditions.includes('narrow')) return 'difficult';
  if (conditions.includes('parking') || conditions.includes('lift')) return 'moderate';
  return 'easy';
}

function notifyOpsTeam(quote) {
  // Implement notification system (email, SMS, etc.)
  console.log(`New quote ${quote.id} requires operations review`);
}

function sendQuoteToClient(quote) {
  // Implement client notification system
  console.log(`Quote ${quote.id} sent to client`);
}

function processPayment(paymentData) {
  // Integrate with payment processor (Stripe, PayPal, etc.)
  return {
    success: true,
    transaction_id: `TXN-${Date.now()}`
  };
}

function assignCrewAndDispatch(job) {
  // Implement crew assignment logic
  console.log(`Job ${job.id} assigned to crew and dispatched`);
}

function notifyOpsForVerification(job) {
  // Notify operations team for job verification
  console.log(`Job ${job.id} completed, requires verification`);
}

function generateFinalInvoice(job) {
  const invoice = {
    id: `INV-${Date.now()}`,
    job_id: job.id,
    amount: job.remaining_balance,
    created_at: new Date().toISOString()
  };
  return invoice;
}

// Operations Dashboard Endpoints
app.get('/api/ops/pending-quotes', (req, res) => {
  const pendingQuotes = quotes.filter(q => q.status === 'under_review');
  res.json(pendingQuotes);
});

app.get('/api/ops/pending-verifications', (req, res) => {
  const pendingJobs = jobs.filter(j => j.status === 'completed');
  res.json(pendingJobs);
});

// Auth Endpoints
app.post('/api/auth/login/client', (req, res) => {
  const { email, password } = req.body;
  // Implement your auth logic
  res.json({ success: true, token: 'client-token', user: { email, role: 'client' } });
});

app.post('/api/auth/login/admin', (req, res) => {
  const { email, password } = req.body;
  // Implement your auth logic
  res.json({ success: true, token: 'admin-token', user: { email, role: 'admin' } });
});

app.post('/api/auth/login/crew', (req, res) => {
  const { email, password } = req.body;
  // Implement your auth logic
  res.json({ success: true, token: 'crew-token', user: { email, role: 'crew' } });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});

module.exports = app;