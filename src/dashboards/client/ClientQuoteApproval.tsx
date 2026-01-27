import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobStore } from '../../store/jobStore';
import { Job } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { Check, X, DollarSign, Calendar, MapPin, FileText, CreditCard, AlertTriangle } from 'lucide-react';
import { ClientQuoteAcceptance } from '../../components/common/ClientQuoteAcceptance';
import { DepositCollection } from '../../components/common/DepositCollection';
import { BookingSuccessAnimation } from '../../components/common/BookingSuccessAnimation';
import { ClientBookingCancel } from '../../components/common/ClientBookingCancel';
import { useStatusPopup } from '../../components/common/StatusPopupManager';
import { InvoiceGenerator } from '../../components/common/InvoiceGenerator';
import { getClientQuotes } from '../../services/authService';
import { approveClientQuote, rejectClientQuote } from '../../services/api';

export const ClientQuoteApproval: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentStep, setCurrentStep] = useState<'list' | 'quote-review' | 'deposit-payment' | 'booking-confirmed'>('list');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelJob, setSelectedCancelJob] = useState<Job | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceJob, setInvoiceJob] = useState<Job | null>(null);
  const { showStatus, StatusPopup } = useStatusPopup();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await getClientQuotes();
      // Transform API data to match component expectations
      const transformedJobs = data.map((quote: any) => ({
        id: quote.job_id,
        job_id: quote.job_id,
        propertyAddress: quote.property_address,
        serviceType: quote.service_type,
        scheduledDate: quote.preferred_date,
        status: quote.status === 'Awaiting Approval' ? 'admin-quoted' : 
                quote.status === 'quote_accepted' ? 'client-approved' :
                'quote-rejected',
        quoteDetails: {
          quotedAmount: quote.quote_amount,
          depositAmount: quote.deposit_amount,
          notes: quote.quote_notes
        },
        createdAt: quote.created_at
      }));
      setJobs(transformedJobs);
    } catch (error: any) {
      console.error('Failed to fetch quotes:', error);
      alert('Failed to load quotes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (job: Job) => {
    setSelectedCancelJob(job);
    setShowCancelModal(true);
  };

  const handleCancelSuccess = () => {
    setShowCancelModal(false);
    setSelectedCancelJob(null);
    // Refresh the jobs list
    const quotedJobs = jobStore.getJobs().filter(j => 
      j.clientId === '1' && (
        j.status === 'admin-quoted' || j.status === 'client-approved' || j.status === 'payment-pending'
      )
    );
    setJobs(quotedJobs);
  };

  const canCancelJob = (job: Job) => {
    return ['admin-quoted', 'client-approved', 'payment-pending'].includes(job.status) && job.status !== 'cancelled';
  };

  const handleViewQuote = (job: Job) => {
    setSelectedJob(job);
    setCurrentStep('quote-review');
  };

  const handleQuoteAccept = async () => {
    if (!selectedJob) return;
    
    try {
      const response = await approveClientQuote(selectedJob.job_id || selectedJob.id);
      if (response.success) {
        alert('Quote approved successfully!');
        setCurrentStep('list');
        setSelectedJob(null);
        // Refresh quotes list
        fetchQuotes();
      } else {
        alert(`❌ Error: ${response.error}`);
      }
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleQuoteReject = async (reason: string) => {
    if (!selectedJob) return;
    
    try {
      const response = await rejectClientQuote(selectedJob.job_id || selectedJob.id, reason);
      if (response.success) {
        alert('Quote declined successfully');
        setCurrentStep('list');
        setSelectedJob(null);
        // Refresh quotes list
        fetchQuotes();
      } else {
        alert(`❌ Error: ${response.error}`);
      }
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    if (!selectedJob) return;

    const result = jobStore.processPayment(selectedJob.id, paymentData);
    
    if (result.success) {
      showStatus('payment-success');
      setCurrentStep('list');
      setSelectedJob(null);
    } else {
      alert(`❌ Payment failed: ${result.error}`);
    }
  };

  const handlePaymentError = (error: string) => {
    alert(`❌ Payment failed: ${error}`);
  };

  const handleBackToList = () => {
    setCurrentStep('list');
    setSelectedJob(null);
  };

  // Render different steps
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotes...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'quote-review' && selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          <button 
            onClick={handleBackToList}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Quotes
          </button>
        </div>
        <ClientQuoteAcceptance 
          job={selectedJob}
          onAccept={handleQuoteAccept}
          onReject={handleQuoteReject}
        />
      </div>
    );
  }

  if (currentStep === 'deposit-payment' && selectedJob) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4">
          <button 
            onClick={() => setCurrentStep('quote-review')}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Quote
          </button>
        </div>
        <DepositCollection 
          job={selectedJob}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-green-600 via-blue-600 to-green-600 p-8 mb-8 overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-2">Your Quotes 📋</h2>
          <p className="text-green-100">Review and approve quotes from admin</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FileText size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Quotes Available</h3>
            <p className="text-gray-600">You don't have any quotes to review at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={`${job.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    {job.id}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    job.status === 'admin-quoted' ? 'bg-yellow-100 text-yellow-700' :
                    job.status === 'client-approved' ? 'bg-green-100 text-green-700' :
                    job.status === 'payment-pending' ? 'bg-orange-100 text-orange-700' :
                    job.status === 'booking-confirmed' ? 'bg-purple-100 text-purple-700' :
                    job.status === 'crew-assigned' ? 'bg-indigo-100 text-indigo-700' :
                    job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    job.status === 'work-completed' ? 'bg-teal-100 text-teal-700' :
                    job.status === 'admin-verified' ? 'bg-cyan-100 text-cyan-700' :
                    job.status === 'completed' ? 'bg-green-100 text-green-700' :
                    job.status === 'quote-rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status === 'admin-quoted' ? '⏳ Awaiting Approval' :
                     job.status === 'client-approved' ? '✅ Approved' :
                     job.status === 'payment-pending' ? '💳 Payment Pending' :
                     job.status === 'booking-confirmed' ? '📋 Booking Confirmed' :
                     job.status === 'crew-assigned' ? '👷 Crew Assigned' :
                     job.status === 'in-progress' ? '🚧 In Progress' :
                     job.status === 'work-completed' ? '✔️ Work Completed' :
                     job.status === 'admin-verified' ? '💰 Final Payment Due' :
                     job.status === 'completed' ? '🎉 Completed' :
                     job.status === 'quote-rejected' ? '❌ Rejected' :
                     job.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-blue-600" />
                    <span className="truncate">{job.propertyAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-green-600" />
                    <span>{formatDate(job.scheduledDate)}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-1">Quoted Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(job.quoteDetails?.quotedAmount || 0)}
                  </p>
                </div>

                {job.quoteDetails?.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Admin Notes</p>
                    <p className="text-sm text-gray-900">{job.quoteDetails.notes}</p>
                  </div>
                )}

                {job.status === 'quote-rejected' && job.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs text-red-600 mb-1 font-semibold flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Rejection Reason
                    </p>
                    <p className="text-sm text-red-900">{job.rejectionReason}</p>
                  </div>
                )}

                {job.status === 'quote-rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-red-700 font-medium">Quote was rejected by you</p>
                    <p className="text-xs text-red-600 mt-1">Contact admin for a new quote</p>
                  </div>
                )}

                {(job.status === 'booking-confirmed' || job.status === 'crew-assigned' || 
                  job.status === 'in-progress' || job.status === 'work-completed' || job.status === 'completed') && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-green-700 font-medium">Quote Accepted & Job Active</p>
                    <p className="text-xs text-green-600 mt-1">Track progress in Job Tracking</p>
                  </div>
                )}

                {job.status === 'admin-quoted' && (
                  <div className="flex gap-2">
                    {canCancelJob(job) && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCancelBooking(job)}
                        className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                      >
                        <X size={16} />
                        Cancel
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleViewQuote(job)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <FileText size={20} />
                      Review Quote
                    </motion.button>
                  </div>
                )}

                {job.status === 'admin-verified' && (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const totalAmount = job.verifiedFinalPrice || job.finalQuote?.fixedPrice || job.estimatedValue || 0;
                        const depositPaid = job.finalQuote?.depositAmount || 0;
                        const remainingAmount = totalAmount - depositPaid;
                        
                        const paymentData = {
                          amount: remainingAmount,
                          paidAt: new Date().toISOString(),
                          transactionId: `txn_${Date.now()}`,
                          method: 'card'
                        };
                        
                        const result = jobStore.processFinalPayment(job.id, paymentData);
                        
                        if (result.success) {
                          const updatedJob = jobStore.getJobById(job.id);
                          if (updatedJob) {
                            setInvoiceJob(updatedJob);
                            setShowInvoice(true);
                          }
                        } else {
                          alert(`❌ Payment Failed: ${result.error}`);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <CreditCard size={20} />
                      Pay Final Amount
                    </motion.button>
                  </div>
                )}

                {job.status === 'payment-pending' && (
                  <div className="flex gap-2">
                    {canCancelJob(job) && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCancelBooking(job)}
                        className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                      >
                        <X size={16} />
                        Cancel
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedJob(job);
                        setCurrentStep('deposit-payment');
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <CreditCard size={20} />
                      Complete Payment
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Booking Modal */}
      {selectedCancelJob && (
        <ClientBookingCancel
          job={selectedCancelJob}
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedCancelJob(null);
          }}
          onCancelSuccess={handleCancelSuccess}
        />
      )}

      {/* Invoice Modal */}
      {showInvoice && invoiceJob && (
        <InvoiceGenerator
          job={invoiceJob}
          onClose={() => {
            setShowInvoice(false);
            setInvoiceJob(null);
          }}
        />
      )}

      <StatusPopup />
    </div>
  );
};
