import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobStore } from '../../store/jobStore';
import { Job } from '../../types';
import { FileText, CheckCircle, DollarSign, Calendar, MapPin, User, Download } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';

export const InvoiceGeneration: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const updateJobs = () => {
      const paidJobs = jobStore.getJobs().filter(j => 
        j.paymentStatus === 'success' && !j.invoiceGenerated
      );
      setJobs(paidJobs);
    };
    updateJobs();
    return jobStore.subscribe(updateJobs);
  }, []);

  const handleGenerateInvoice = (job: Job) => {
    const result = jobStore.generateInvoice(job.id);
    
    if (result.success) {
      alert(`✅ Invoice Generated Successfully!\n\n📄 Invoice ID: ${result.invoiceId}\n📧 Client will be notified\n💾 Invoice saved to system`);
      setSelectedJob(null);
    } else {
      alert(`❌ Error: ${result.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pb-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-green-600 via-blue-600 to-green-700 p-8 mb-8 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-2">Invoice Generation 📄</h2>
          <p className="text-green-100 text-lg">Generate invoices for completed and paid jobs</p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{jobs.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl">
                <FileText size={32} className="text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">
                  {formatCurrency(jobs.reduce((sum, j) => sum + (j.finalPrice || 0), 0))}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl">
                <DollarSign size={32} className="text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Invoice</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">
                  {jobs.length > 0 ? formatCurrency(jobs.reduce((sum, j) => sum + (j.finalPrice || 0), 0) / jobs.length) : '£0'}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl">
                <CheckCircle size={32} className="text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center"
          >
            <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">All Invoices Generated! 🎉</h3>
            <p className="text-gray-600">No pending invoices at the moment.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => setSelectedJob(job)}
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    {job.id}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    ✅ Paid
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 mb-3">{job.clientName}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="text-blue-600" />
                    <span className="truncate">{job.propertyAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-green-600" />
                    <span>Paid: {formatDate(job.paidAt || '')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} className="text-orange-600" />
                    <span>{job.crewAssigned?.join(', ') || 'No crew'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-gray-600">Amount Paid</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(job.finalPrice || 0)}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateInvoice(job);
                  }}
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  Generate Invoice
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Generate Invoice</h3>
              <p className="text-gray-600">{selectedJob.immutableReferenceId}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Invoice Details</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Client:</span>
                  <span className="font-semibold text-gray-900">{selectedJob.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold text-gray-900 capitalize">{selectedJob.serviceType.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold text-gray-900">{formatDate(selectedJob.completedAt || '')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-semibold text-gray-900">{formatDate(selectedJob.paidAt || '')}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(selectedJob.finalPrice || 0)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleGenerateInvoice(selectedJob)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <FileText size={20} />
                Generate Invoice
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
