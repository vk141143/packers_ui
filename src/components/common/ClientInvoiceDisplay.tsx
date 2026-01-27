import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle, Calendar, MapPin, User, CreditCard } from 'lucide-react';
import { Job } from '../../types';

interface ClientInvoiceDisplayProps {
  job: Job;
  invoiceId: string;
}

export const ClientInvoiceDisplay: React.FC<ClientInvoiceDisplayProps> = ({
  job,
  invoiceId
}) => {
  const handleDownloadInvoice = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = `/invoices/${invoiceId}.pdf`;
    link.download = `Invoice-${invoiceId}.pdf`;
    link.click();
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="border-b pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
            <p className="text-gray-600 mt-1">Payment Receipt & Service Summary</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
              <CheckCircle size={20} className="text-green-600" />
              <span className="text-green-800 font-semibold">PAID</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Invoice Number</p>
              <p className="font-semibold text-gray-900">{invoiceId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Job Reference</p>
              <p className="font-semibold text-gray-900">{job.immutableReferenceId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Issue Date</p>
              <p className="font-semibold text-gray-900">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Date</p>
              <p className="font-semibold text-gray-900">
                {job.paidAt ? new Date(job.paidAt).toLocaleDateString() : new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User size={16} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold text-gray-900">{job.clientName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Property Address</p>
                <p className="font-semibold text-gray-900">{job.pickupAddress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Service Date</p>
                <p className="font-semibold text-gray-900">
                  {job.completedAt ? new Date(job.completedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileText size={20} className="text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Service Type</p>
            <p className="font-semibold text-gray-900 capitalize">
              {job.serviceType.replace('-', ' ')}
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Work Duration</p>
            <p className="font-semibold text-gray-900">
              {job.completionTimeMinutes ? 
                `${Math.floor(job.completionTimeMinutes / 60)}h ${job.completionTimeMinutes % 60}m` : 
                'N/A'
              }
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 font-bold">{job.photos?.length || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Photos Taken</p>
            <p className="font-semibold text-gray-900">Documentation</p>
          </div>
        </div>
      </div>

      {/* Billing Breakdown */}
      <div className="border rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Base Service - {job.serviceType.replace('-', ' ')}</span>
            <span className="text-gray-900">£{(job.finalPrice || 0) * 0.8}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">SLA Commitment ({job.slaType})</span>
            <span className="text-gray-900">£{(job.finalPrice || 0) * 0.15}</span>
          </div>
          {job.urgency === 'emergency' && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Emergency Premium</span>
              <span className="text-gray-900">£{(job.finalPrice || 0) * 0.05}</span>
            </div>
          )}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-gray-900">Total Amount</span>
              <span className="text-gray-900">£{job.finalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-green-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
          <CreditCard size={20} />
          Payment Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-green-700">Payment Method</p>
            <p className="font-semibold text-green-900">
              {job.paymentMethod ? job.paymentMethod.toUpperCase() : 'CARD'}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-700">Payment Status</p>
            <p className="font-semibold text-green-900">COMPLETED</p>
          </div>
          <div>
            <p className="text-sm text-green-700">Transaction Date</p>
            <p className="font-semibold text-green-900">
              {job.paidAt ? new Date(job.paidAt).toLocaleString() : new Date().toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-700">Amount Paid</p>
            <p className="font-semibold text-green-900">£{job.finalPrice}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleDownloadInvoice}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          <Download size={18} />
          Download PDF
        </button>
        <button
          onClick={handlePrintInvoice}
          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
        >
          <FileText size={18} />
          Print Invoice
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
        <p>Thank you for choosing our services!</p>
        <p>For any questions regarding this invoice, please contact our support team.</p>
      </div>
    </motion.div>
  );
};