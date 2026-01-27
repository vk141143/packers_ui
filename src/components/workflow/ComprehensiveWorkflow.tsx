import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  FileText, 
  Send, 
  CreditCard, 
  Calendar, 
  Truck, 
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  XCircle,
  RefreshCw
} from 'lucide-react';

// Step 1: AI Internal Estimate (NEVER shown to client)
interface AIInternalEstimate {
  id: string;
  jobId: string;
  estimatedVanLoads: number;
  riskFlags: ('hoarder' | 'hazardous' | 'access')[];
  suggestedPriceRange: {
    min: number;
    max: number;
    recommended: number;
  };
  confidence: number;
  analysisData: {
    photoAnalysis: string[];
    propertySize: string;
    wasteTypes: string[];
    accessNotes: string;
  };
  generatedAt: string;
  isInternal: true; // CRITICAL: Never expose to client
}

// Step 2: Operations Review (MANDATORY)
interface OperationsReview {
  id: string;
  jobId: string;
  aiEstimateId: string;
  reviewedBy: string;
  reviewedAt: string;
  approved: boolean;
  
  // Operations can modify these
  finalPrice: number;
  riskBuffer: number;
  wasteClassification: string[];
  requiresSiteVisit: boolean;
  
  // Internal notes (never shown to client)
  internalNotes: string;
  
  // What gets sent to client
  clientQuote: {
    fixedPrice: number;
    depositAmount: number;
    scopeOfWork: string[];
    completionTimeline: string;
    cancellationTerms: string;
  };
}

// Step 3: Final Quote (Only this is sent to client)
interface ClientQuote {
  id: string;
  jobId: string;
  finalPrice: number;
  depositAmount: number;
  scopeOfWork: string[];
  completionTimeline: string;
  cancellationTerms: string;
  validUntil: string;
  sentAt: string;
  clientResponse?: {
    accepted: boolean;
    acceptedAt: string;
    rejectedReason?: string;
  };
}

// Workflow State
interface WorkflowJob {
  id: string;
  clientName: string;
  propertyAddress: string;
  photos: string[];
  clientNotes: string;
  currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  
  // Step data
  aiEstimate?: AIInternalEstimate;
  opsReview?: OperationsReview;
  clientQuote?: ClientQuote;
  depositPaid?: boolean;
  depositPaidAt?: string;
  scheduled?: boolean;
  scheduledDate?: string;
  crewAssigned?: string[];
  workCompleted?: boolean;
  completedAt?: string;
  verified?: boolean;
  finalInvoiced?: boolean;
  
  // Cancellation fields
  status?: 'active' | 'cancelled' | 'refunded';
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  refundStatus?: 'pending' | 'processed' | 'failed';
  refundAmount?: number;
  refundedAt?: string;
}

export const ComprehensiveWorkflow: React.FC = () => {
  const [jobs, setJobs] = useState<WorkflowJob[]>([
    {
      id: 'JOB-001',
      clientName: 'John Smith',
      propertyAddress: '123 Main St, London',
      photos: ['photo1.jpg', 'photo2.jpg'],
      clientNotes: 'House clearance needed, some furniture',
      currentStep: 1,
      status: 'active'
    }
  ]);
  
  const [selectedJob, setSelectedJob] = useState<WorkflowJob | null>(null);
  const [showInternalData, setShowInternalData] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  // Cancellation Policy
  const canCancelJob = (job: WorkflowJob): { allowed: boolean; reason: string } => {
    if (job.status === 'cancelled' || job.status === 'refunded') {
      return { allowed: false, reason: 'Job already cancelled' };
    }
    if (job.depositPaid) {
      return { allowed: false, reason: 'Cannot cancel after deposit paid' };
    }
    if (job.currentStep >= 6) {
      return { allowed: false, reason: 'Cannot cancel after job scheduled' };
    }
    if (job.workCompleted) {
      return { allowed: false, reason: 'Cannot cancel completed work' };
    }
    return { allowed: true, reason: 'Cancellation allowed' };
  };

  // Cancel Job Function
  const cancelJob = async (jobId: string, reason: string) => {
    if (!reason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    setIsProcessingCancel(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          const refundAmount = job.opsReview?.finalPrice || job.aiEstimate?.suggestedPriceRange.recommended || 0;
          return {
            ...job,
            status: 'refunded' as const,
            cancellationReason: reason,
            cancelledBy: 'Client',
            cancelledAt: new Date().toISOString(),
            refundStatus: 'processed' as const,
            refundAmount,
            refundedAt: new Date().toISOString()
          };
        }
        return job;
      }));
      
      setShowCancelModal(null);
      setCancellationReason('');
      alert(`Job cancelled successfully! Refund will be processed within 5-7 business days.`);
    } catch (error) {
      alert('Failed to cancel job. Please try again.');
    } finally {
      setIsProcessingCancel(false);
    }
  };

  // Step 1: Generate AI Internal Estimate
  const generateAIEstimate = (job: WorkflowJob) => {
    const aiEstimate: AIInternalEstimate = {
      id: `AI-${Date.now()}`,
      jobId: job.id,
      estimatedVanLoads: 2,
      riskFlags: ['access'],
      suggestedPriceRange: {
        min: 400,
        max: 600,
        recommended: 500
      },
      confidence: 0.85,
      analysisData: {
        photoAnalysis: ['Moderate furniture density', 'Standard access'],
        propertySize: '3-bedroom house',
        wasteTypes: ['furniture', 'general'],
        accessNotes: job.clientNotes
      },
      generatedAt: new Date().toISOString(),
      isInternal: true
    };

    setJobs(prev => prev.map(j => 
      j.id === job.id 
        ? { ...j, aiEstimate, currentStep: 2 as const }
        : j
    ));
  };

  // Step 2: Operations Review (MANDATORY)
  const submitOpsReview = (job: WorkflowJob, reviewData: Partial<OperationsReview>) => {
    const opsReview: OperationsReview = {
      id: `OPS-${Date.now()}`,
      jobId: job.id,
      aiEstimateId: job.aiEstimate!.id,
      reviewedBy: 'Operations Team',
      reviewedAt: new Date().toISOString(),
      approved: true,
      finalPrice: reviewData.finalPrice || 550,
      riskBuffer: reviewData.riskBuffer || 50,
      wasteClassification: ['general', 'furniture'],
      requiresSiteVisit: false,
      internalNotes: reviewData.internalNotes || '',
      clientQuote: {
        fixedPrice: reviewData.finalPrice || 550,
        depositAmount: Math.round((reviewData.finalPrice || 550) * 0.3),
        scopeOfWork: [
          'Complete property clearance',
          'Furniture removal and disposal',
          'Basic cleaning after clearance'
        ],
        completionTimeline: '2-3 working days',
        cancellationTerms: 'Free cancellation 24h before scheduled date'
      }
    };

    setJobs(prev => prev.map(j => 
      j.id === job.id 
        ? { ...j, opsReview, currentStep: 3 as const }
        : j
    ));
  };

  // Step 3: Create and Send Final Quote
  const sendQuoteToClient = (job: WorkflowJob) => {
    if (!job.opsReview) return;

    const clientQuote: ClientQuote = {
      id: `QUOTE-${Date.now()}`,
      jobId: job.id,
      ...job.opsReview.clientQuote,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      sentAt: new Date().toISOString()
    };

    setJobs(prev => prev.map(j => 
      j.id === job.id 
        ? { ...j, clientQuote, currentStep: 4 as const }
        : j
    ));

    alert('✅ Quote sent to client! Client will only see the final price and terms.');
  };

  // Step 4: Client Accepts Quote
  const clientAcceptsQuote = (job: WorkflowJob) => {
    if (!job.clientQuote) return;

    const updatedQuote = {
      ...job.clientQuote,
      clientResponse: {
        accepted: true,
        acceptedAt: new Date().toISOString()
      }
    };

    setJobs(prev => prev.map(j => 
      j.id === job.id 
        ? { 
            ...j, 
            clientQuote: updatedQuote, 
            currentStep: job.clientQuote!.depositAmount > 0 ? 5 as const : 6 as const 
          }
        : j
    ));
  };

  // Step 5: Collect Deposit (if required)
  const collectDeposit = (job: WorkflowJob) => {
    setJobs(prev => prev.map(j => 
      j.id === job.id 
        ? { 
            ...j, 
            depositPaid: true,
            depositPaidAt: new Date().toISOString(),
            currentStep: 6 as const 
          }
        : j
    ));
    alert('💰 Deposit collected! Job is now locked and non-cancellable.');
  };

  // Step 6: Schedule Job
  const scheduleJob = (job: WorkflowJob) => {
    setJobs(prev => prev.map(j => 
      j.id === job.id 
        ? { 
            ...j, 
            scheduled: true,
            scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            crewAssigned: ['Mike Johnson', 'Sarah Wilson'],
            currentStep: 7 as const 
          }
        : j
    ));
    alert('📅 Job scheduled and crew assigned!');
  };

  // Step 7: Complete Job
  const completeJob = (job: WorkflowJob) => {
    setJobs(prev => prev.map(j => 
      j.id === job.id 
        ? { 
            ...j, 
            workCompleted: true,
            completedAt: new Date().toISOString(),
            currentStep: 8 as const 
          }
        : j
    ));
    alert('✅ Job completed by crew! Ready for verification.');
  };

  // Step 8: Verify and Invoice
  const verifyAndInvoice = (job: WorkflowJob) => {
    setJobs(prev => prev.map(j => 
      j.id === job.id 
        ? { 
            ...j, 
            verified: true,
            finalInvoiced: true
          }
        : j
    ));
    alert('📄 Work verified and final invoice sent to client!');
  };

  const getStepStatus = (job: WorkflowJob, step: number) => {
    if (job.currentStep > step) return 'completed';
    if (job.currentStep === step) return 'current';
    return 'pending';
  };

  const steps = [
    { number: 1, title: 'AI Internal Estimate', icon: Brain, color: 'blue' },
    { number: 2, title: 'Operations Review', icon: Shield, color: 'orange' },
    { number: 3, title: 'Final Quote Creation', icon: FileText, color: 'purple' },
    { number: 4, title: 'Quote Sent to Client', icon: Send, color: 'green' },
    { number: 5, title: 'Deposit Collection', icon: CreditCard, color: 'yellow' },
    { number: 6, title: 'Job Scheduling', icon: Calendar, color: 'indigo' },
    { number: 7, title: 'Job Execution', icon: Truck, color: 'red' },
    { number: 8, title: 'Verification & Invoice', icon: CheckCircle, color: 'emerald' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Waste Management Workflow</h1>
            <p className="text-blue-200">Complete 8-step process with mandatory operations approval</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowInternalData(!showInternalData)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                showInternalData 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {showInternalData ? <EyeOff size={20} /> : <Eye size={20} />}
              {showInternalData ? 'Hide Internal Data' : 'Show Internal Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid gap-6">
        {jobs.map(job => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            {/* Job Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{job.id}</h3>
                <p className="text-gray-600">{job.clientName} • {job.propertyAddress}</p>
                {job.status === 'cancelled' && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="w-3 h-3 mr-1" />
                      Cancelled
                    </span>
                  </div>
                )}
                {job.status === 'refunded' && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Refunded
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Step</p>
                <p className="text-lg font-bold text-blue-600">Step {job.currentStep}</p>
                {(() => {
                  const cancelPolicy = canCancelJob(job);
                  return cancelPolicy.allowed && (
                    <button
                      onClick={() => setShowCancelModal(job.id)}
                      className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" />
                      Cancel Job
                    </button>
                  );
                })()} 
              </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                {steps.map((step, index) => {
                  const status = getStepStatus(job, step.number);
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.number} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        status === 'completed' 
                          ? `bg-${step.color}-600 text-white` 
                          : status === 'current'
                          ? `bg-${step.color}-100 text-${step.color}-600 ring-2 ring-${step.color}-600`
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <p className={`text-xs text-center max-w-20 ${
                        status === 'current' ? 'font-semibold text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((job.currentStep - 1) / 7) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Step Actions */}
            <div className="space-y-4">
              {/* Cancellation Notice */}
              {(job.status === 'cancelled' || job.status === 'refunded') && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-600 p-3 rounded-xl">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-red-900 mb-2">Job Cancelled</h3>
                      <p className="text-red-700 mb-2">{job.cancellationReason}</p>
                      <p className="text-sm text-red-600">Cancelled by {job.cancelledBy} on {job.cancelledAt && new Date(job.cancelledAt).toLocaleDateString()}</p>
                      {job.refundStatus === 'processed' && (
                        <div className="bg-white border border-red-200 rounded-lg p-4 mt-3">
                          <p className="text-sm text-gray-600 mb-1">Refund Status: <span className="font-bold text-green-600">Processed</span></p>
                          <p className="text-sm text-gray-600">Amount: <span className="font-bold">£{job.refundAmount}</span></p>
                          <p className="text-xs text-gray-500 mt-2">Refunded on {job.refundedAt && new Date(job.refundedAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* Step 1: AI Estimate */}
              {job.currentStep === 1 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Brain className="text-blue-600" size={24} />
                    <h4 className="font-semibold text-blue-900">Step 1: Generate AI Internal Estimate</h4>
                    <Lock className="text-red-500" size={16} />
                    <span className="text-xs text-red-600 font-medium">INTERNAL ONLY</span>
                  </div>
                  <p className="text-blue-800 text-sm mb-4">
                    AI will analyze photos, property size, waste type and access to generate internal estimate.
                    This information is NEVER shown to the client.
                  </p>
                  <button
                    onClick={() => generateAIEstimate(job)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Generate AI Estimate
                  </button>
                </div>
              )}

              {/* Step 2: Operations Review */}
              {job.currentStep === 2 && (
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="text-orange-600" size={24} />
                    <h4 className="font-semibold text-orange-900">Step 2: Operations Review (MANDATORY)</h4>
                    <AlertTriangle className="text-red-500" size={16} />
                  </div>
                  
                  {showInternalData && job.aiEstimate && (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
                      <p className="text-red-800 font-semibold text-sm mb-2">🔒 INTERNAL AI ESTIMATE (Never shown to client):</p>
                      <div className="text-sm text-red-700 space-y-1">
                        <p>• Van Loads: {job.aiEstimate.estimatedVanLoads}</p>
                        <p>• Risk Flags: {job.aiEstimate.riskFlags.join(', ')}</p>
                        <p>• Price Range: £{job.aiEstimate.suggestedPriceRange.min} - £{job.aiEstimate.suggestedPriceRange.max}</p>
                        <p>• Recommended: £{job.aiEstimate.suggestedPriceRange.recommended}</p>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-orange-800 text-sm mb-4">
                    Operations team must review AI estimate and set final pricing. NO job proceeds without ops approval.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Final Price (£)</label>
                      <input 
                        type="number" 
                        defaultValue="550"
                        className="w-full px-3 py-2 border rounded-lg"
                        id={`price-${job.id}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Risk Buffer (£)</label>
                      <input 
                        type="number" 
                        defaultValue="50"
                        className="w-full px-3 py-2 border rounded-lg"
                        id={`buffer-${job.id}`}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Internal Notes</label>
                    <textarea 
                      className="w-full px-3 py-2 border rounded-lg"
                      rows={2}
                      placeholder="Internal notes (never shown to client)"
                      id={`notes-${job.id}`}
                    />
                  </div>
                  
                  <button
                    onClick={() => {
                      const price = Number((document.getElementById(`price-${job.id}`) as HTMLInputElement).value);
                      const buffer = Number((document.getElementById(`buffer-${job.id}`) as HTMLInputElement).value);
                      const notes = (document.getElementById(`notes-${job.id}`) as HTMLTextAreaElement).value;
                      
                      submitOpsReview(job, { finalPrice: price, riskBuffer: buffer, internalNotes: notes });
                    }}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                  >
                    Approve & Create Final Quote
                  </button>
                </div>
              )}

              {/* Step 3: Final Quote Creation */}
              {job.currentStep === 3 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="text-purple-600" size={24} />
                    <h4 className="font-semibold text-purple-900">Step 3: Final Quote Ready</h4>
                  </div>
                  
                  {job.opsReview && (
                    <div className="bg-white rounded-lg p-4 mb-4 border">
                      <h5 className="font-semibold mb-2">Quote Details (What client will see):</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Fixed Price:</strong> £{job.opsReview.clientQuote.fixedPrice}</p>
                          <p><strong>Deposit:</strong> £{job.opsReview.clientQuote.depositAmount}</p>
                        </div>
                        <div>
                          <p><strong>Timeline:</strong> {job.opsReview.clientQuote.completionTimeline}</p>
                          <p><strong>Scope:</strong> {job.opsReview.clientQuote.scopeOfWork.length} items</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => sendQuoteToClient(job)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Send Quote to Client
                  </button>
                </div>
              )}

              {/* Step 4: Quote Sent */}
              {job.currentStep === 4 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Send className="text-green-600" size={24} />
                    <h4 className="font-semibold text-green-900">Step 4: Quote Sent to Client</h4>
                  </div>
                  <p className="text-green-800 text-sm mb-4">
                    Client has received the quote and must accept to proceed.
                  </p>
                  <button
                    onClick={() => clientAcceptsQuote(job)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Simulate Client Acceptance
                  </button>
                </div>
              )}

              {/* Step 5: Deposit Collection */}
              {job.currentStep === 5 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="text-yellow-600" size={24} />
                    <h4 className="font-semibold text-yellow-900">Step 5: Collect Deposit</h4>
                  </div>
                  <p className="text-yellow-800 text-sm mb-4">
                    Deposit of £{job.clientQuote?.depositAmount} required before job can be scheduled.
                  </p>
                  <button
                    onClick={() => collectDeposit(job)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                  >
                    Collect Deposit
                  </button>
                </div>
              )}

              {/* Step 6: Job Scheduling */}
              {job.currentStep === 6 && (
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="text-indigo-600" size={24} />
                    <h4 className="font-semibold text-indigo-900">Step 6: Schedule Job</h4>
                  </div>
                  <p className="text-indigo-800 text-sm mb-4">
                    Assign crew and schedule the job. Dispatch will be sent automatically.
                  </p>
                  <button
                    onClick={() => scheduleJob(job)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Schedule & Assign Crew
                  </button>
                </div>
              )}

              {/* Step 7: Job Execution */}
              {job.currentStep === 7 && (
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="text-red-600" size={24} />
                    <h4 className="font-semibold text-red-900">Step 7: Job in Progress</h4>
                  </div>
                  {job.crewAssigned && (
                    <p className="text-red-800 text-sm mb-2">
                      Crew: {job.crewAssigned.join(', ')}
                    </p>
                  )}
                  {job.scheduledDate && (
                    <p className="text-red-800 text-sm mb-4">
                      Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}
                    </p>
                  )}
                  <button
                    onClick={() => completeJob(job)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Mark Job Complete
                  </button>
                </div>
              )}

              {/* Step 8: Verification & Invoice */}
              {job.currentStep === 8 && (
                <div className="bg-emerald-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="text-emerald-600" size={24} />
                    <h4 className="font-semibold text-emerald-900">Step 8: Verify & Invoice</h4>
                  </div>
                  <p className="text-emerald-800 text-sm mb-4">
                    Verify work completion and send final invoice for remaining balance.
                  </p>
                  {!job.verified && (
                    <button
                      onClick={() => verifyAndInvoice(job)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                    >
                      Verify Work & Send Final Invoice
                    </button>
                  )}
                  {job.verified && (
                    <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-3">
                      <p className="text-emerald-800 font-semibold">✅ Job Complete!</p>
                      <p className="text-emerald-700 text-sm">Work verified and final invoice sent.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Key Points */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🔑 Key Workflow Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <Lock className="text-red-500" size={16} />
              <span><strong>AI Estimate:</strong> Internal only, never shown to client</span>
            </p>
            <p className="flex items-center gap-2">
              <AlertTriangle className="text-orange-500" size={16} />
              <span><strong>Operations Review:</strong> Mandatory step, no job proceeds without approval</span>
            </p>
            <p className="flex items-center gap-2">
              <FileText className="text-purple-500" size={16} />
              <span><strong>Final Quote:</strong> Only price sent to client, no AI data exposed</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} />
              <span><strong>Client Acceptance:</strong> Required before any work begins</span>
            </p>
            <p className="flex items-center gap-2">
              <XCircle className="text-red-500" size={16} />
              <span><strong>Cancellation:</strong> Allowed until deposit paid or job scheduled</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <CreditCard className="text-yellow-500" size={16} />
              <span><strong>Deposit:</strong> Job locked and non-cancellable after payment</span>
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="text-indigo-500" size={16} />
              <span><strong>Scheduling:</strong> Automatic crew assignment and dispatch</span>
            </p>
            <p className="flex items-center gap-2">
              <Truck className="text-red-500" size={16} />
              <span><strong>Execution:</strong> Crew uploads proof of completion</span>
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="text-emerald-500" size={16} />
              <span><strong>Final Invoice:</strong> Only after ops verification</span>
            </p>
            <p className="flex items-center gap-2">
              <RefreshCw className="text-blue-500" size={16} />
              <span><strong>Refunds:</strong> Full refund processed within 5-7 business days</span>
            </p>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Cancel Job</h3>
              <p className="text-gray-600">Are you sure you want to cancel this job?</p>
              <p className="text-xs text-gray-500 mt-2">Job ID: <span className="font-mono text-sm">{showCancelModal}</span></p>
            </div>
            
            {(() => {
              const job = jobs.find(j => j.id === showCancelModal);
              const refundAmount = job?.opsReview?.finalPrice || job?.aiEstimate?.suggestedPriceRange.recommended || 0;
              return refundAmount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-900 font-semibold mb-2">Refund Information</p>
                  <p className="text-sm text-blue-700">Full refund of <span className="font-bold">£{refundAmount}</span> will be processed within 5-7 business days</p>
                </div>
              );
            })()}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for cancellation *</label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
                placeholder="Please tell us why you're cancelling..."
                disabled={isProcessingCancel}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(null);
                  setCancellationReason('');
                }}
                disabled={isProcessingCancel}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Keep Job
              </button>
              <button
                onClick={() => cancelJob(showCancelModal, cancellationReason)}
                disabled={isProcessingCancel || !cancellationReason.trim()}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessingCancel ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle size={20} />
                    Confirm Cancel
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};