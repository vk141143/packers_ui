// Additional API endpoints to complete the workflow

// Client approval endpoints
app.get('/api/quotes/pending-approval', async (req, res) => {
  try {
    const quotes = await Quote.find({ status: 'ops_approved' });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/quotes/:id/approve', async (req, res) => {
  try {
    const { approved } = req.body;
    const quote = await Quote.findById(req.params.id);
    
    if (approved) {
      quote.status = 'client_approved';
      // Create job from approved quote
      const job = new Job({
        quoteId: quote._id,
        clientName: quote.clientName,
        services: quote.services,
        scheduledDate: quote.estimatedDate,
        status: 'scheduled',
        finalPrice: quote.finalPrice
      });
      await job.save();
    } else {
      quote.status = 'client_rejected';
    }
    
    await quote.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Job management endpoints
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ scheduledDate: 1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/jobs/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'in_progress' && { startedAt: new Date() }),
        ...(status === 'completed' && { completedAt: new Date(), progress: 100 })
      },
      { new: true }
    );
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quality verification endpoints
app.get('/api/jobs/completed', async (req, res) => {
  try {
    const jobs = await Job.find({ 
      status: { $in: ['completed', 'verified'] } 
    }).sort({ completedAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/jobs/:id/verify', async (req, res) => {
  try {
    const { verified, notes } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        status: verified ? 'verified' : 'needs_review',
        verificationNotes: notes,
        verifiedAt: new Date()
      },
      { new: true }
    );
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/jobs/:id/request-feedback', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    // Send feedback request email/SMS to client
    // Implementation depends on your notification service
    
    job.feedbackRequested = true;
    job.feedbackRequestedAt = new Date();
    await job.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Client feedback submission (public endpoint)
app.post('/api/jobs/:id/feedback', async (req, res) => {
  try {
    const { rating, comments, issues } = req.body;
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        clientFeedback: { rating, comments, issues },
        status: issues && issues.length > 0 ? 'issues_reported' : 'verified'
      },
      { new: true }
    );
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Job schema addition
const jobSchema = new mongoose.Schema({
  quoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
  clientName: String,
  services: [String],
  scheduledDate: Date,
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'verified', 'issues_reported'],
    default: 'scheduled'
  },
  finalPrice: Number,
  teamAssigned: [String],
  progress: { type: Number, default: 0 },
  photos: [String],
  startedAt: Date,
  completedAt: Date,
  verifiedAt: Date,
  verificationNotes: String,
  feedbackRequested: { type: Boolean, default: false },
  feedbackRequestedAt: Date,
  clientFeedback: {
    rating: Number,
    comments: String,
    issues: [String]
  }
});

const Job = mongoose.model('Job', jobSchema);