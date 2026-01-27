import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminQuotes, getSentQuotes, getAcceptedQuotes } from '../../services/authService';
import { Job } from '../../types';
import { Send, CheckCircle, Clock, Mail, Phone, Building, Edit3, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import { sendQuoteEmail } from '../../services/emailService';
import { useStatusPopup } from '../../components/common/StatusPopupManager';

export const QuoteManagement: React.FC = () => {
  const [pendingQuotes, setPendingQuotes] = useState<any[]>([]);
  const [sentQuotes, setSentQuotes] = useState<any[]>([]);
  const [acceptedQuotes, setAcceptedQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [sendingQuote, setSendingQuote] = useState(false);
  const [updatedJobId, setUpdatedJobId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const { showStatus, StatusPopup } = useStatusPopup();

  useEffect(() => {
    fetchQuoteData();
  }, []);

  const fetchQuoteData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const [adminQuotesData, sentQuotesData, acceptedQuotesData] = await Promise.all([
        getAdminQuotes().catch((error) => {
          console.error('Admin quotes error:', error);
          return [];
        }),
        getSentQuotes().catch((error) => {
          console.error('Sent quotes error:', error);
          return [];
        }),
        getAcceptedQuotes().catch((error) => {
          console.error('Accepted quotes error:', error);
          return [];
        })
      ]);
      
      setPendingQuotes(adminQuotesData || []);
      setSentQuotes(sentQuotesData || []);
      setAcceptedQuotes(acceptedQuotesData || []);
    } catch (error) {
      console.error('Failed to fetch quote data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showUpdateFeedback = (jobId: string) => {
    setUpdatedJobId(jobId);
    setTimeout(() => setUpdatedJobId(null), 5000);
  };

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 5000);
  };

  const handleSendQuote = async (jobId: string) => {
    if (!quoteAmount || !depositAmount) {
      showToastMessage('Please enter both quote amount and deposit amount', 'error');
      return;
    }
    
    setSendingQuote(true);
    
    try {
      const job = pendingQuotes.find(j => j.id === jobId);
      if (!job) {
        showToastMessage('Job not found', 'error');
        return;
      }

      // Call the actual API to send quote
      const token = localStorage.getItem('access_token');
      const actualJobId = job.job_id || job.id || jobId;
      const response = await fetch(`/crew-api/admin/quotes/${actualJobId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          quote_amount: parseFloat(quoteAmount),
          deposit_amount: parseFloat(depositAmount),
          notes: quoteNotes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send quote');
      }
      
      setQuoteAmount('');
      setDepositAmount('');
      setQuoteNotes('');
      setSelectedJobId(null);
      
      // Refresh the data after sending quote
      setTimeout(async () => {
        await fetchQuoteData();
      }, 1000);
      
      showToastMessage('Quote sent successfully!', 'success');
      
    } catch (error) {
      showToastMessage('Error sending quote', 'error');
      console.error('Quote send error:', error);
    } finally {
      setSendingQuote(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
              showToast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {showToast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {showToast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                Quote Management 💰
              </h1>
              <p className="text-gray-600 text-lg">Create and manage quotes for client booking requests</p>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-700 font-medium">Pending Quotes</p>
                <p className="text-3xl font-bold text-orange-800">{pendingQuotes.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {pendingQuotes.length === 0 && sentQuotes.length === 0 && acceptedQuotes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">All Caught Up! 🎉</h3>
            <p className="text-gray-600 text-lg mb-2">No pending quote requests at the moment</p>
            <p className="text-sm text-gray-500">All client booking requests have been processed</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {pendingQuotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    Pending Quotes - Action Required
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {pendingQuotes.length} pending
                    </span>
                  </h3>
                  <p className="text-orange-100 mt-2">These quotes need your immediate attention</p>
                </div>
                <div className="p-6 space-y-6">
                  {pendingQuotes.map((job, index) => {
                    const isSelected = selectedJobId === job.job_id;
                    const isUpdated = false;
                    
                    return (
                      <motion.div
                        key={job.id || `pending-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          scale: isUpdated ? [1, 1.02, 1] : 1,
                          backgroundColor: isUpdated ? ['#f3f4f6', '#dbeafe', '#f3f4f6'] : '#f9fafb'
                        }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ 
                          delay: index * 0.1,
                          scale: { duration: 0.3 },
                          backgroundColor: { duration: 2 }
                        }}
                        className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all relative"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{job.id}</h3>
                            <p className="text-gray-600 font-medium">{job.clientName}</p>
                            <p className="text-sm text-gray-500">{job.serviceType}</p>
                          </div>
                          <div className="flex items-center gap-2 text-orange-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">Quote Needed</span>
                          </div>
                        </div>
                        
                        {/* Client Booking Details */}
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Client Booking Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Property Address:</span>
                              <p className="text-gray-600">{job.property_address || 'Not specified'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Service Type:</span>
                              <p className="text-gray-600 capitalize">{(job.service_type || job.serviceType || 'service').replace('-', ' ')}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Scheduled Date:</span>
                              <p className="text-gray-600">{job.preferred_date || 'Not specified'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Urgency:</span>
                              <p className={`capitalize font-medium ${
                                (job.urgency || job.priority) === 'emergency' ? 'text-red-600' : 'text-green-600'
                              }`}>{job.urgency_level || 'Normal'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Property Size:</span>
                              <p className="text-gray-600">{job.property_size || job.propertySize || 'Not specified'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Van Loads:</span>
                              <p className="text-gray-600">{job.van_loads || job.vanLoads || 'Not specified'}</p>
                            </div>
                            {job.wasteTypes && job.wasteTypes.length > 0 && (
                              <div className="md:col-span-2">
                                <span className="font-medium text-gray-700">Waste Types:</span>
                                <p className="text-gray-600">{job.wasteTypes.join(', ')}</p>
                              </div>
                            )}
                            {job.accessDifficulty && job.accessDifficulty.length > 0 && (
                              <div className="md:col-span-2">
                                <span className="font-medium text-gray-700">Access Difficulty:</span>
                                <p className="text-gray-600">{job.accessDifficulty.join(', ')}</p>
                              </div>
                            )}
                            {job.clientDetails && (
                              <>
                                {job.clientDetails.email && (
                                  <div>
                                    <span className="font-medium text-gray-700">Email:</span>
                                    <p className="text-gray-600 flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {job.clientDetails.email}
                                    </p>
                                  </div>
                                )}
                                {job.clientDetails.phone && (
                                  <div>
                                    <span className="font-medium text-gray-700">Phone:</span>
                                    <p className="text-gray-600 flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {job.clientDetails.phone}
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                            <div>
                              <span className="font-medium text-gray-700">Estimated Value:</span>
                              <p className="text-gray-600 font-semibold">£{job.estimated_value || job.estimatedValue || '0'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">SLA Type:</span>
                              <p className="text-gray-600">{job.sla_hours || 'Standard'}</p>
                            </div>
                          </div>
                          {job.description && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <span className="font-medium text-gray-700">Additional Information:</span>
                              <p className="text-gray-600 mt-1">{job.description}</p>
                            </div>
                          )}
                          {job.notes && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <span className="font-medium text-gray-700">Client Notes:</span>
                              <p className="text-gray-600 mt-1">{job.notes}</p>
                            </div>
                          )}
                          {job.photos && job.photos.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <span className="font-medium text-gray-700 mb-2 block">Client Photos:</span>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {job.photos.map((photo, index) => (
                                  <div key={photo.id || index} className="relative group">
                                    <img
                                      src={photo.url}
                                      alt={`Client photo ${index + 1}`}
                                      className="w-full h-20 object-cover rounded border hover:opacity-75 cursor-pointer"
                                      onClick={() => window.open(photo.url, '_blank')}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded transition-all" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="border-t pt-4">
                          {isSelected ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quote Amount ($)
                                  </label>
                                  <input
                                    type="number"
                                    value={quoteAmount}
                                    onChange={(e) => setQuoteAmount(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter quote amount"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deposit Amount ($)
                                  </label>
                                  <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter deposit amount"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Quote Notes (Optional)
                                </label>
                                <textarea
                                  value={quoteNotes}
                                  onChange={(e) => setQuoteNotes(e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={3}
                                  placeholder="Add any additional notes for the client"
                                />
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleSendQuote(job.job_id || job.quote_id)}
                                  disabled={sendingQuote || !quoteAmount || !depositAmount}
                                  className="flex-1 py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                  {sendingQuote ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-4 h-4" />
                                      Send Quote
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedJobId(null);
                                    setQuoteAmount('');
                                    setDepositAmount('');
                                    setQuoteNotes('');
                                  }}
                                  className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedJobId(job.job_id);
                              }}
                              className="w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                            >
                              Create Quote & Set Deposit
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Sent Quotes Section */}
            {sentQuotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Send className="w-6 h-6" />
                    </div>
                    Sent Quotes - Awaiting Client Response
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {sentQuotes.length} sent
                    </span>
                  </h3>
                  <p className="text-blue-100 mt-2">Quotes sent to clients waiting for approval</p>
                </div>
                <div className="p-6 space-y-6">
                  {sentQuotes.map((job, index) => (
                    <motion.div
                      key={job.job_id || `sent-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{job.job_id}</h3>
                          <p className="text-gray-600 font-medium">{job.client}</p>
                          <p className="text-sm text-gray-500">Quote Sent</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          QUOTE SENT
                        </span>
                      </div>

                      {/* Quote Details */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Quote Details
                        </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <span className="text-xs text-blue-700 font-medium">Total Amount</span>
                              <p className="text-lg font-bold text-blue-900">£{job.total_amount}</p>
                            </div>
                            <div>
                              <span className="text-xs text-blue-700 font-medium">Deposit Amount</span>
                              <p className="text-lg font-bold text-blue-900">£{job.deposit_amount}</p>
                            </div>
                            <div>
                              <span className="text-xs text-blue-700 font-medium">Remaining</span>
                              <p className="text-lg font-bold text-blue-900">£{job.remaining_amount}</p>
                            </div>
                            <div>
                              <span className="text-xs text-blue-700 font-medium">Quoted By</span>
                              <p className="text-sm font-semibold text-blue-900">{job.quoted_by}</p>
                            </div>
                          </div>
                          {job.quoteDetails?.notes && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <span className="text-xs text-blue-700 font-medium">Quote Notes:</span>
                              <p className="text-sm text-blue-900 mt-1">{job.quoteDetails.notes}</p>
                            </div>
                          )}
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-blue-700">Sent on: {new Date(job.sent_on).toLocaleString()}</span>
                              <span className="text-blue-700">Valid until: {job.valid_until}</span>
                            </div>
                          </div>
                        </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Accepted Quotes Section */}
            {acceptedQuotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    Accepted Quotes
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {acceptedQuotes.length} active
                    </span>
                  </h3>
                  <p className="text-green-100 mt-2">Quotes that have been sent and accepted by clients</p>
                </div>
                <div className="p-6 space-y-6">
                  {acceptedQuotes.map((job, index) => (
                    <motion.div
                      key={job.id || `accepted-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl shadow-sm p-6 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{job.id}</h3>
                          <p className="text-gray-600 font-medium">{job.clientName}</p>
                          <p className="text-sm text-gray-500">{job.serviceType}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job.status === 'completed' ? 'bg-green-100 text-green-700' :
                            job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            job.status === 'booking-confirmed' ? 'bg-purple-100 text-purple-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {job.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Quote Details */}
                      {job.finalQuote && (
                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Quote Details
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <span className="text-xs text-green-700 font-medium">Total Amount</span>
                              <p className="text-lg font-bold text-green-900">£{job.finalQuote.fixedPrice}</p>
                            </div>
                            <div>
                              <span className="text-xs text-green-700 font-medium">Deposit Amount</span>
                              <p className="text-lg font-bold text-green-900">£{job.finalQuote.depositAmount}</p>
                            </div>
                            <div>
                              <span className="text-xs text-green-700 font-medium">Remaining</span>
                              <p className="text-lg font-bold text-green-900">£{job.finalQuote.fixedPrice - job.finalQuote.depositAmount}</p>
                            </div>
                            <div>
                              <span className="text-xs text-green-700 font-medium">Quoted By</span>
                              <p className="text-sm font-semibold text-green-900">{job.finalQuote.quotedBy}</p>
                            </div>
                          </div>
                          {job.quoteDetails?.notes && (
                            <div className="mt-3 pt-3 border-t border-green-200">
                              <span className="text-xs text-green-700 font-medium">Quote Notes:</span>
                              <p className="text-sm text-green-900 mt-1">{job.quoteDetails.notes}</p>
                            </div>
                          )}
                          <div className="mt-3 pt-3 border-t border-green-200">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-green-700">Quoted on: {new Date(job.finalQuote.quotedAt).toLocaleString()}</span>
                              {job.clientApproval && (
                                <span className="text-green-700">Accepted on: {new Date(job.clientApproval.approvedAt).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Payment Status */}
                      {job.initialPayment && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Payment Status
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-xs text-blue-700 font-medium">Deposit Paid</span>
                              <p className="text-lg font-bold text-blue-900">£{job.initialPayment.amount}</p>
                            </div>
                            <div>
                              <span className="text-xs text-blue-700 font-medium">Payment Status</span>
                              <p className={`text-sm font-semibold ${
                                job.paymentStatus === 'success' ? 'text-green-600' : 'text-yellow-600'
                              }`}>
                                {job.paymentStatus === 'success' ? '✅ Paid' : '⏳ Pending'}
                              </p>
                            </div>
                            {job.initialPayment.paidAt && (
                              <div>
                                <span className="text-xs text-blue-700 font-medium">Paid On</span>
                                <p className="text-sm text-blue-900">{new Date(job.initialPayment.paidAt).toLocaleDateString()}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
      <StatusPopup />
    </div>
  );
};