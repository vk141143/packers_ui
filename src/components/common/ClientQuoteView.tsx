import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { jobStore } from '../../store/jobStore';
import { Job } from '../../types';
import { CheckCircle, Clock, CreditCard, FileText, Calendar, MapPin } from 'lucide-react';

interface ClientQuoteViewProps {
  clientId: string;
}

export const ClientQuoteView: React.FC<ClientQuoteViewProps> = ({ clientId }) => {
  const [jobs] = useState<Job[]>(jobStore.getJobsByClientId(clientId));
  const [acceptingQuote, setAcceptingQuote] = useState<string | null>(null);

  // Filter jobs that have quotes waiting for client approval
  const quotedJobs = jobs.filter(job => job.status === 'admin-quoted');

  const handleAcceptQuote = async (jobId: string) => {
    setAcceptingQuote(jobId);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = jobStore.approveQuote(jobId, 'Client');
      
      if (result.success) {
        alert('Quote accepted! You will be redirected to payment.');
      } else {
        alert('Failed to accept quote: ' + result.error);
      }
    } catch (error) {
      alert('Error accepting quote');
    } finally {
      setAcceptingQuote(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl text-white"
      >
        <h2 className="text-3xl font-bold mb-2">Your Quotes 📋</h2>
        <p className="text-blue-100">Review and accept quotes for your booking requests</p>
      </motion.div>

      {quotedJobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-xl">No quotes available</p>
          <p className="text-sm mt-2">Your quotes will appear here once our team reviews your booking requests</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {quotedJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{job.id}</h3>
                  <p className="text-gray-600">{job.serviceType.replace('-', ' ').toUpperCase()}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{job.propertyAddress}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Quote Ready</span>
                </div>
              </div>

              {job.quoteDetails && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-green-800">Quote Details</h4>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(job.quoteDetails.quotedAmount)}
                      </p>
                      <p className="text-sm text-green-600">Total Amount</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Quoted By</p>
                      <p className="font-medium">{job.quoteDetails.quotedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Valid Until</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(job.quoteDetails.validUntil)}
                      </p>
                    </div>
                  </div>

                  {job.quoteDetails.notes && (
                    <div className="bg-white border border-green-200 rounded p-3 mb-4">
                      <p className="text-sm text-gray-600 mb-1">Additional Notes:</p>
                      <p className="text-sm">{job.quoteDetails.notes}</p>
                    </div>
                  )}

                  <div className="border-t border-green-200 pt-4">
                    <h5 className="font-medium text-green-800 mb-2">Price Breakdown:</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Base Service Price</span>
                        <span>{formatCurrency(job.quoteDetails.breakdown.basePrice)}</span>
                      </div>
                      {job.quoteDetails.breakdown.additionalCharges?.map((charge, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{charge.description}</span>
                          <span>{formatCurrency(charge.amount)}</span>
                        </div>
                      ))}
                      <div className="border-t border-green-200 pt-1 mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>{formatCurrency(job.quoteDetails.quotedAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleAcceptQuote(job.id)}
                  disabled={acceptingQuote === job.id}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <CreditCard className="w-4 h-4" />
                  {acceptingQuote === job.id ? 'Processing...' : 'Accept Quote & Pay'}
                </button>
                
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                  Request Changes
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> Once you accept this quote, you'll be redirected to our secure payment portal. 
                  After payment confirmation, your booking will be confirmed and crew will be assigned.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};