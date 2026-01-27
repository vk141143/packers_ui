import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobStore } from '../../store/jobStore';
// import { useAuth } from '../../contexts/AuthContext'; // Removed for demo mode
import { Job } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { CreditCard, CheckCircle, Clock, Receipt, ArrowLeft, DollarSign, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ClientPaymentDetails: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useAuth(); // Removed for demo mode
  const user = { id: '1' }; // Hardcoded for demo
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const updateJobs = () => {
      const allJobs = jobStore.getJobs();
      const clientJobs = allJobs.filter(j => 
        j.clientId === user?.id && 
        (j.status === 'booking-confirmed' || j.status === 'final-payment-pending' || j.status === 'completed')
      );
      setJobs(clientJobs);
    };
    updateJobs();
    return jobStore.subscribe(updateJobs);
  }, [user?.id]);

  const getPaymentStatus = (job: Job) => {
    if (job.status === 'completed') return { text: 'Fully Paid', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    if (job.status === 'final-payment-pending') return { text: 'Final Payment Due', color: 'bg-orange-100 text-orange-800', icon: Clock };
    if (job.status === 'booking-confirmed') return { text: 'Deposit Paid', color: 'bg-blue-100 text-blue-800', icon: CreditCard };
    return { text: 'Pending', color: 'bg-gray-100 text-gray-800', icon: Clock };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/client')} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white"
        >
          <h1 className="text-3xl font-bold mb-2">💳 Payment Details</h1>
          <p className="text-blue-100">View payment information for your accepted quotes</p>
        </motion.div>

        <div className="grid gap-6">
          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Details Available</h3>
              <p className="text-gray-600">You don't have any jobs with payment information yet.</p>
            </div>
          ) : (
            jobs.map(job => {
              const paymentStatus = getPaymentStatus(job);
              const StatusIcon = paymentStatus.icon;
              
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 mb-1">{job.id}</h3>
                      <p className="text-gray-600">{job.propertyAddress}</p>
                      <p className="text-sm text-gray-500">{job.serviceType.replace('-', ' ')}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatus.color} flex items-center gap-2`}>
                        <StatusIcon size={16} />
                        {paymentStatus.text}
                      </span>
                    </div>
                  </div>

                  {job.finalQuote && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      {/* Total Amount */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign size={20} className="text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Total Amount</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatCurrency(job.finalQuote.fixedPrice)}
                        </p>
                      </div>

                      {/* Deposit Paid */}
                      <div className={`rounded-lg p-4 ${
                        job.initialPayment?.paidAt ? 'bg-green-50' : 'bg-yellow-50'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {job.initialPayment?.paidAt ? (
                            <CheckCircle size={20} className="text-green-600" />
                          ) : (
                            <Clock size={20} className="text-yellow-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            job.initialPayment?.paidAt ? 'text-green-800' : 'text-yellow-800'
                          }`}>
                            {job.initialPayment?.paidAt ? 'Deposit Paid' : 'Deposit Status'}
                          </span>
                        </div>
                        <p className={`text-2xl font-bold ${
                          job.initialPayment?.paidAt ? 'text-green-900' : 'text-yellow-900'
                        }`}>
                          {formatCurrency(job.finalQuote.depositAmount)}
                        </p>
                        {job.initialPayment?.paidAt ? (
                          <p className="text-xs text-green-700 mt-1">
                            ✓ Paid: {new Date(job.initialPayment.paidAt).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-xs text-yellow-700 mt-1">
                            ⏳ Payment pending
                          </p>
                        )}
                      </div>

                      {/* Remaining Balance */}
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={20} className="text-orange-600" />
                          <span className="text-sm font-medium text-orange-800">Remaining Balance</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-900">
                          {formatCurrency(job.finalQuote.fixedPrice - job.finalQuote.depositAmount)}
                        </p>
                        <p className="text-xs text-orange-700 mt-1">
                          Due after completion
                        </p>
                      </div>

                      {/* Payment Status */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={20} className="text-gray-600" />
                          <span className="text-sm font-medium text-gray-800">Status</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {job.status === 'completed' ? 'Complete' : 
                           job.status === 'final-payment-pending' ? 'Awaiting Final' :
                           'In Progress'}
                        </p>
                        {job.finalPayment?.paidAt && (
                          <p className="text-xs text-gray-700 mt-1">
                            Final paid: {new Date(job.finalPayment.paidAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Timeline */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Payment Timeline</h4>
                    <div className="space-y-4">
                      {/* Quote Accepted */}
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle size={16} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Quote Accepted</p>
                          <p className="text-sm text-gray-600">
                            {job.clientApproval?.approvedAt ? 
                              new Date(job.clientApproval.approvedAt).toLocaleString() : 
                              'Quote accepted'
                            }
                          </p>
                        </div>
                        <span className="text-green-600 font-medium">✓</span>
                      </div>

                      {/* Deposit Payment */}
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          job.initialPayment ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <CreditCard size={16} className={job.initialPayment ? 'text-green-600' : 'text-gray-400'} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Deposit Payment</p>
                          <p className="text-sm text-gray-600">
                            {job.initialPayment?.paidAt ? 
                              `Paid ${new Date(job.initialPayment.paidAt).toLocaleString()}` : 
                              `${formatCurrency(job.finalQuote?.depositAmount || 0)} required`
                            }
                          </p>
                        </div>
                        <span className={job.initialPayment ? 'text-green-600 font-medium' : 'text-gray-400'}>
                          {job.initialPayment ? '✓' : '○'}
                        </span>
                      </div>

                      {/* Final Payment */}
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          job.finalPayment?.paidAt ? 'bg-green-100' : 
                          job.status === 'final-payment-pending' ? 'bg-orange-100' : 'bg-gray-100'
                        }`}>
                          <DollarSign size={16} className={
                            job.finalPayment?.paidAt ? 'text-green-600' : 
                            job.status === 'final-payment-pending' ? 'text-orange-600' : 'text-gray-400'
                          } />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Final Payment</p>
                          <p className="text-sm text-gray-600">
                            {job.finalPayment?.paidAt ? 
                              `Paid ${new Date(job.finalPayment.paidAt).toLocaleString()}` : 
                              job.status === 'final-payment-pending' ? 
                                `${formatCurrency(job.finalPayment?.amount || 0)} due` :
                                'Due after work completion'
                            }
                          </p>
                        </div>
                        <span className={
                          job.finalPayment?.paidAt ? 'text-green-600 font-medium' : 
                          job.status === 'final-payment-pending' ? 'text-orange-600 font-medium' : 'text-gray-400'
                        }>
                          {job.finalPayment?.paidAt ? '✓' : 
                           job.status === 'final-payment-pending' ? '!' : '○'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-6 border-t">
                    <button
                      onClick={() => navigate(`/client/tracking/${job.id}`)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Job Details
                    </button>
                    {job.status === 'final-payment-pending' && (
                      <button
                        onClick={() => navigate(`/client/tracking/${job.id}`)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Pay Final Amount
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};