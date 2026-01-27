import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Job } from '../../types';
import { FinalPriceSection } from './FinalPriceSection';
import { 
  CheckCircle, 
  Clock, 
  CreditCard, 
  AlertTriangle, 
  DollarSign, 
  FileText,
  Camera,
  MapPin,
  User,
  Calendar,
  Edit3,
  Send
} from 'lucide-react';

interface EnhancedJobDetailsProps {
  job: Job;
  onUpdateJob?: (jobId: string, updates: Partial<Job>) => void;
  onSendFinalPaymentRequest?: (jobId: string) => void;
}

export const EnhancedJobDetails: React.FC<EnhancedJobDetailsProps> = ({ 
  job, 
  onUpdateJob,
  onSendFinalPaymentRequest 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleUpdateFinalPrice = (amount: number) => {
    if (onUpdateJob) {
      // Update the remaining amount in finalQuote
      const updatedJob = {
        ...job,
        finalQuote: {
          ...job.finalQuote!,
          // Keep the original fixed price, but we could add a finalAmount field
          finalAmount: amount
        }
      };
      onUpdateJob(job.id, updatedJob);
    }
  };

  const handleSendPaymentRequest = () => {
    if (onSendFinalPaymentRequest) {
      onSendFinalPaymentRequest(job.id);
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      'client-booking-request': { color: 'bg-orange-100 text-orange-800', label: 'Quote Needed' },
      'admin-quoted': { color: 'bg-blue-100 text-blue-800', label: 'Quote Sent' },
      'client-approved': { color: 'bg-green-100 text-green-800', label: 'Quote Accepted' },
      'payment-pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Deposit Pending' },
      'booking-confirmed': { color: 'bg-green-100 text-green-800', label: 'Booking Confirmed' },
      'crew-assigned': { color: 'bg-purple-100 text-purple-800', label: 'Crew Assigned' },
      'in-progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      'work-completed': { color: 'bg-orange-100 text-orange-800', label: 'Needs Verification' },
      'admin-reviewed': { color: 'bg-green-100 text-green-800', label: 'Work Verified' },
      'final-payment-pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Final Payment Pending' },
      'completed': { color: 'bg-green-100 text-green-800', label: 'Completed' }
    };

    const config = statusConfig[job.status] || { color: 'bg-gray-100 text-gray-800', label: job.status };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const acceptedQuoteAmount = job.finalQuote?.fixedPrice || 0;
  const depositPaid = job.finalQuote?.depositAmount || 0;
  const remainingAmount = acceptedQuoteAmount - depositPaid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold mb-2">Job #{job.immutableReferenceId}</h3>
            <p className="text-blue-100">{job.serviceType.replace('-', ' ').toUpperCase()}</p>
          </div>
          <div className="text-right">
            {getStatusBadge()}
            <p className="text-blue-100 text-sm mt-2">
              {new Date(job.scheduledDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="p-6 border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-semibold">{job.clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Property</p>
              <p className="font-semibold">{job.propertyAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Photos</p>
              <p className="font-semibold">{job.photos?.length || 0} uploaded</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {acceptedQuoteAmount > 0 && (
        <div className="p-6 border-b">
          <FinalPriceSection 
            job={job} 
            onUpdateFinalPrice={handleUpdateFinalPrice}
            readOnly={job.status === 'completed'}
          />
        </div>
      )}

      {/* Action Buttons */}
      {job.status === 'work-completed' && (
        <div className="p-6 bg-orange-50 border-b">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <div>
              <h4 className="font-semibold text-orange-800">Action Required</h4>
              <p className="text-sm text-orange-600">
                Work has been completed. Verify the job and send final payment request.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {showDetails ? 'Hide Details' : 'Review Work'}
            </button>
            <button
              onClick={handleSendPaymentRequest}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Payment Request (£{remainingAmount.toFixed(2)})
            </button>
          </div>
        </div>
      )}

      {job.status === 'final-payment-pending' && (
        <div className="p-6 bg-blue-50 border-b">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-800">Payment Request Sent</h4>
              <p className="text-sm text-blue-600">
                Client has been notified to pay £{remainingAmount.toFixed(2)}. 
                Job will complete automatically once payment is received.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Information (Expandable) */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-6 bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Checklist */}
            {job.checklist && job.checklist.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Work Checklist</h4>
                <div className="space-y-2">
                  {job.checklist.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <CheckCircle 
                        className={`w-4 h-4 ${item.completed ? 'text-green-600' : 'text-gray-300'}`} 
                      />
                      <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos */}
            {job.photos && job.photos.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Work Photos</h4>
                <div className="grid grid-cols-2 gap-2">
                  {job.photos.slice(0, 4).map((photo, index) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        alt={`${photo.type} photo`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <span className={`absolute top-1 left-1 px-2 py-1 rounded text-xs font-bold ${
                        photo.type === 'before' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                      }`}>
                        {photo.type}
                      </span>
                    </div>
                  ))}
                </div>
                {job.photos.length > 4 && (
                  <p className="text-sm text-gray-500 mt-2">
                    +{job.photos.length - 4} more photos
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};