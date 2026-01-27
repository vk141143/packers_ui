import React, { useState } from 'react';
import { X, Check, AlertTriangle, FileText, Camera, PoundSterling } from 'lucide-react';
import { Job } from '../../types';
import { useStatusPopup } from './StatusPopupManager';

interface JobVerificationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (jobId: string, finalPrice: number) => void;
  onReject: (jobId: string, reason: string) => void;
}

export const JobVerificationModal: React.FC<JobVerificationModalProps> = ({
  job,
  isOpen,
  onClose,
  onVerify,
  onReject
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [finalPrice, setFinalPrice] = useState(job.estimatedValue?.toString() || '');
  const { showStatus, StatusPopup } = useStatusPopup();

  if (!isOpen) return null;

  const handleVerify = () => {
    const price = parseFloat(finalPrice);
    if (price > 0) {
      showStatus('job-completed');
      onVerify(job.id, price);
      onClose();
    } else {
      alert('Please enter a valid final price');
    }
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(job.id, rejectionReason);
      onClose();
      setRejectionReason('');
      setShowRejectForm(false);
    }
  };

  const completedTasks = job.checklist?.filter(item => item.completed).length || 0;
  const totalTasks = job.checklist?.length || 0;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Job Verification</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Job Details</h3>
              <p><strong>ID:</strong> {job.immutableReferenceId}</p>
              <p><strong>Client:</strong> {job.clientName}</p>
              <p><strong>Address:</strong> {job.propertyAddress}</p>
              <p><strong>Service:</strong> {job.serviceType}</p>
              <p><strong>Crew:</strong> {job.crewAssigned?.join(', ')}</p>
              <p><strong>Completed:</strong> {job.completedAt ? new Date(job.completedAt).toLocaleString() : 'N/A'}</p>
            </div>

            {/* Checklist */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">
                Checklist Completion ({completedTasks}/{totalTasks}) - {completionRate.toFixed(0)}%
              </h3>
              <div className="space-y-2">
                {job.checklist?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      item.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {item.completed && <Check size={12} className="text-white" />}
                    </div>
                    <span className={item.completed ? 'text-green-700' : 'text-gray-600'}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <Camera size={20} className="mr-2" />
                Photos ({job.photos?.length || 0})
              </h3>
              {job.photos && job.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {job.photos.map((photo) => (
                    <div key={photo.id} className="relative">
                      <img 
                        src={photo.url} 
                        alt={`${photo.type} photo`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                        {photo.type}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No photos uploaded</p>
              )}
            </div>

            {/* Report */}
            {job.reportGenerated && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FileText size={20} className="mr-2" />
                  Compliance Report
                </h3>
                <a 
                  href={job.reportUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Report PDF
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-6 border-t">
          {!showRejectForm ? (
            <div className="space-y-4">
              {/* Final Price Input */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">💰 Set Final Price for Client</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      💵 Final Amount to Send Client *
                    </label>
                    <input
                      type="number"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="text-sm text-blue-600">
                    <p>📋 Original estimate: £{job.estimatedValue}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                >
                  <AlertTriangle size={20} className="mr-2" />
                  Reject
                </button>
                <button
                  onClick={handleVerify}
                  disabled={!finalPrice || parseFloat(finalPrice) <= 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  <Check size={20} className="mr-2" />
                  💳 Send Final Price £{finalPrice || '0.00'} to Client
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rejection Reason</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  rows={3}
                  placeholder="Please provide a reason for rejection..."
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <StatusPopup />
    </div>
  );
};