import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobStore } from '../../store/jobStore';
import { Job } from '../../types';
import { CreditCard, CheckCircle, Clock, DollarSign, Calendar, User, Building } from 'lucide-react';

export const PaymentTracking: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const updateJobs = () => setJobs(jobStore.getJobs());
    updateJobs();
    return jobStore.subscribe(updateJobs);
  }, []);

  const paidJobs = jobs.filter(job => 
    job.paymentStatus === 'success' || job.status === 'completed' || job.status === 'booking-confirmed'
  );
  
  const pendingPayments = jobs.filter(job => 
    job.status === 'payment-pending' || job.status === 'final-payment-pending'
  );

  const totalPaid = paidJobs.reduce((sum, job) => 
    sum + (job.finalQuote?.fixedPrice || job.estimatedValue || 0), 0
  );

  const totalPending = pendingPayments.reduce((sum, job) => {
    const total = job.finalQuote?.fixedPrice || job.estimatedValue || 0;
    const deposit = job.finalQuote?.depositAmount || 0;
    return sum + (job.status === 'payment-pending' ? deposit : total - deposit);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 mb-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Payment Tracking 💳</h1>
          <p className="text-green-100">Monitor all payments and financial transactions</p>
        </div>

        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-3xl font-bold text-green-600">£{totalPaid.toFixed(0)}</p>
                <p className="text-sm text-green-500">{paidJobs.length} completed jobs</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-3xl font-bold text-orange-600">£{totalPending.toFixed(0)}</p>
                <p className="text-sm text-orange-500">{pendingPayments.length} awaiting payment</p>
              </div>
              <Clock className="w-12 h-12 text-orange-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-600">£{(totalPaid + totalPending).toFixed(0)}</p>
                <p className="text-sm text-blue-500">All jobs combined</p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-500" />
            </div>
          </motion.div>
        </div>

        {/* Paid Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg mb-8"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-2xl text-white">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <CheckCircle className="w-8 h-8" />
              Completed Payments ({paidJobs.length})
            </h2>
          </div>
          <div className="p-6">
            {paidJobs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No completed payments yet</p>
            ) : (
              <div className="space-y-4">
                {paidJobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{job.id}</h3>
                        <p className="text-gray-600 flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {job.clientName}
                        </p>
                      </div>
                    </div>
                    
                    {/* Payment Breakdown */}
                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            £{(job.quoteDetails?.quotedAmount || job.finalQuote?.fixedPrice || job.estimatedValue || 0).toFixed(2)}
                          </p>
                          <p className="text-sm font-medium text-gray-600">Total Amount</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-2xl font-bold ${
                            job.initialPayment?.paidAt ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            £{(job.quoteDetails?.depositAmount || job.finalQuote?.depositAmount || 0).toFixed(2)}
                          </p>
                          <p className="text-sm font-medium text-gray-600">Deposit Paid</p>
                        </div>
                        <div className="text-center">
                          <p className={`text-2xl font-bold ${
                            job.finalPayment?.paidAt ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            £{((job.quoteDetails?.quotedAmount || job.finalQuote?.fixedPrice || job.estimatedValue || 0) - (job.quoteDetails?.depositAmount || job.finalQuote?.depositAmount || 0)).toFixed(2)}
                          </p>
                          <p className="text-sm font-medium text-gray-600">Remaining Paid</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Service Type:</p>
                        <p className="font-medium capitalize">{job.serviceType.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Completed:</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {job.completedAt ? new Date(job.completedAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status:</p>
                        <p className="font-medium text-green-600">✅ Fully Paid</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Pending Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg"
        >
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-2xl text-white">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Clock className="w-8 h-8" />
              Pending Payments ({pendingPayments.length})
            </h2>
          </div>
          <div className="p-6">
            {pendingPayments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending payments</p>
            ) : (
              <div className="space-y-4">
                {pendingPayments.map((job) => {
                  const totalAmount = job.finalQuote?.fixedPrice || job.estimatedValue || 0;
                  const depositAmount = job.finalQuote?.depositAmount || 0;
                  const pendingAmount = job.status === 'payment-pending' ? depositAmount : totalAmount - depositAmount;
                  
                  return (
                    <div key={job.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{job.id}</h3>
                          <p className="text-gray-600 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {job.clientName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600">£{pendingAmount.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">
                            {job.status === 'payment-pending' ? 'Deposit Due' : 'Final Payment Due'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Service Type:</p>
                          <p className="font-medium capitalize">{job.serviceType.replace('-', ' ')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Amount:</p>
                          <p className="font-medium">£{totalAmount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status:</p>
                          <p className={`font-medium capitalize ${
                            job.status === 'payment-pending' ? 'text-orange-600' : 'text-blue-600'
                          }`}>
                            {job.status.replace('-', ' ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Contact:</p>
                          <p className="font-medium">{job.clientDetails?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};