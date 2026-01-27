import React from 'react';
import { motion } from 'framer-motion';
import { Job } from '../../types';
import { CheckCircle, Clock, CreditCard, AlertTriangle, DollarSign, FileText } from 'lucide-react';
import { FinalPriceSection } from './FinalPriceSection';

interface AdminJobStatusTrackerProps {
  job: Job;
}

export const AdminJobStatusTracker: React.FC<AdminJobStatusTrackerProps> = ({ job }) => {
  const getStatusInfo = (status: Job['status']) => {
    switch (status) {
      case 'client-booking-request':
        return { icon: Clock, color: 'orange', label: 'Quote Needed', action: 'Create quote for client' };
      case 'admin-quoted':
        return { icon: Clock, color: 'blue', label: 'Quote Sent', action: 'Awaiting client approval' };
      case 'client-approved':
        return { icon: CheckCircle, color: 'green', label: 'Quote Approved', action: 'Awaiting deposit payment' };
      case 'payment-pending':
        return { icon: CreditCard, color: 'yellow', label: 'Payment Pending', action: 'Client paying deposit' };
      case 'booking-confirmed':
        return { icon: CheckCircle, color: 'green', label: 'Booking Confirmed', action: 'Assign crew to job' };
      case 'crew-assigned':
        return { icon: CheckCircle, color: 'purple', label: 'Crew Assigned', action: 'Crew will be dispatched' };
      case 'in-progress':
        return { icon: Clock, color: 'blue', label: 'Work in Progress', action: 'Crew completing work' };
      case 'work-completed':
        return { icon: AlertTriangle, color: 'orange', label: 'Needs Verification', action: 'Admin must verify & send payment request' };
      case 'admin-reviewed':
        return { icon: CheckCircle, color: 'green', label: 'Work Verified', action: 'Payment request being sent' };
      case 'final-payment-pending':
        return { icon: CreditCard, color: 'yellow', label: 'Payment Requested', action: 'Client paying remaining amount' };
      case 'completed':
        return { icon: CheckCircle, color: 'green', label: 'Fully Completed', action: 'Job finished successfully' };
      default:
        return { icon: Clock, color: 'gray', label: status, action: 'Status unknown' };
    }
  };

  const statusInfo = getStatusInfo(job.status);
  const StatusIcon = statusInfo.icon;

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentInfo = () => {
    // Use accepted quote amount as definitive total
    const totalAmount = job.finalQuote?.fixedPrice || job.estimatedValue || 0;
    const depositPaid = job.finalQuote?.depositAmount || 0;
    const remainingAmount = totalAmount - depositPaid;

    return { totalAmount, depositPaid, remainingAmount };
  };

  const { totalAmount, depositPaid, remainingAmount } = getPaymentInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
    >
      {/* Current Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getColorClasses(statusInfo.color)}`}>
            <StatusIcon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{statusInfo.label}</h3>
            <p className="text-sm text-gray-600">{statusInfo.action}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Job ID</p>
          <p className="font-semibold">{job.immutableReferenceId}</p>
        </div>
      </div>

      {/* Client Booking Details */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <FileText size={16} />
          Client Booking Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600 font-medium">Property Address:</p>
            <p className="text-gray-800">{job.propertyAddress}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Scheduled Date:</p>
            <p className="text-gray-800">{new Date(job.scheduledDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Urgency Level:</p>
            <p className={`font-medium capitalize ${
              job.urgency === 'emergency' ? 'text-red-600' : 'text-green-600'
            }`}>{job.urgency}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">SLA Type:</p>
            <p className="text-gray-800">{job.slaType}</p>
          </div>
          {job.clientDetails?.contactPerson && (
            <div>
              <p className="text-gray-600 font-medium">Contact Person:</p>
              <p className="text-gray-800">{job.clientDetails.contactPerson}</p>
            </div>
          )}
          {job.clientDetails?.phone && (
            <div>
              <p className="text-gray-600 font-medium">Phone:</p>
              <p className="text-gray-800">{job.clientDetails.phone}</p>
            </div>
          )}
          {job.clientDetails?.email && (
            <div>
              <p className="text-gray-600 font-medium">Email:</p>
              <p className="text-gray-800">{job.clientDetails.email}</p>
            </div>
          )}
          <div>
            <p className="text-gray-600 font-medium">Job Size:</p>
            <p className="text-gray-800">{job.jobSize}</p>
          </div>
        </div>
        {job.notes && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-gray-600 font-medium mb-1">Client Notes:</p>
            <p className="text-gray-800 text-sm">{job.notes}</p>
          </div>
        )}
        {job.photos && job.photos.length > 0 && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-gray-600 font-medium mb-2">Client Photos ({job.photos.length}):</p>
            <div className="flex gap-2 overflow-x-auto">
              {job.photos.slice(0, 4).map((photo, idx) => (
                <img
                  key={photo.id || idx}
                  src={photo.url}
                  alt={`Client photo ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-75"
                  onClick={() => window.open(photo.url, '_blank')}
                />
              ))}
              {job.photos.length > 4 && (
                <div className="w-16 h-16 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-600">
                  +{job.photos.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payment Status */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <DollarSign size={16} />
          Payment Status
        </h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white rounded p-2">
            <p className="text-xs text-gray-600">Total Amount</p>
            <p className="font-bold text-blue-600">£{totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded p-2">
            <p className="text-xs text-gray-600">Deposit Paid</p>
            <p className="font-bold text-green-600">£{depositPaid.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded p-2">
            <p className="text-xs text-gray-600">Amount Due</p>
            <p className="font-bold text-orange-600">£{remainingAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      {job.status === 'work-completed' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-orange-800">
            <AlertTriangle size={16} />
            <span className="font-semibold">Action Required</span>
          </div>
          <p className="text-sm text-orange-700 mt-1">
            Work completed by crew. Admin must verify work and send final payment request to client.
          </p>
        </div>
      )}

      {job.status === 'final-payment-pending' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <CreditCard size={16} />
            <span className="font-semibold">Payment Notification Sent</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Client has been notified to pay remaining £{remainingAmount.toFixed(2)}. Job will complete once payment is received.
          </p>
        </div>
      )}

      {/* Work Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Service Type</p>
          <p className="font-medium capitalize">{job.serviceType.replace('-', ' ')}</p>
        </div>
        <div>
          <p className="text-gray-600">Client</p>
          <p className="font-medium">{job.clientName}</p>
        </div>
        <div>
          <p className="text-gray-600">Crew Assigned</p>
          <p className="font-medium">{job.crewAssigned?.join(', ') || 'Not assigned'}</p>
        </div>
        <div>
          <p className="text-gray-600">Photos Uploaded</p>
          <p className="font-medium">{job.photos?.length || 0} photos</p>
        </div>
      </div>
    </motion.div>
  );
};