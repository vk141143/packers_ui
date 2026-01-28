import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { getCrewJobById } from '../../services/authService';
import { Job } from '../../types';
import { MapPin, CheckCircle, Package, ArrowLeft, User, Clock, Star, AlertTriangle, Navigation, Phone, MessageCircle, Play, XCircle, Camera, Upload, Trash2, Check } from 'lucide-react';
import { FlexiblePhotoUpload } from '../../components/common/FlexiblePhotoUpload';
import { useStatusPopup } from '../../components/common/StatusPopupManager';

type JobStep = 'details' | 'arrived' | 'before-photos' | 'in-progress' | 'after-photos' | 'completed';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export const JobDetailsModernEnhanced: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [currentStep, setCurrentStep] = useState<JobStep>('details');
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [arrivalTime, setArrivalTime] = useState<string | null>(null);
  const { showStatus, StatusPopup } = useStatusPopup();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'access', label: 'Access gained successfully', checked: false },
    { id: 'waste', label: 'Waste verified with client', checked: false },
    { id: 'hazard', label: 'No hazardous material found', checked: false },
    { id: 'protect', label: 'Property protected (floors/walls)', checked: false },
    { id: 'loading', label: 'Loading started safely', checked: false }
  ]);
  
  const [showBeforeCamera, setShowBeforeCamera] = useState(false);
  const [showAfterCamera, setShowAfterCamera] = useState(false);

  useEffect(() => {
    if (jobId) {
      const fetchJobDetails = async () => {
        try {
          const jobData = await getCrewJobById(jobId);
          
          // Validate API response
          if (!jobData || !jobData.job_id) {
            throw new Error('Invalid job data received');
          }
          
          // Transform API data to match Job interface
          const transformedJob: Job = {
            id: jobData.job_id,
            immutableReferenceId: jobData.job_id,
            clientName: jobData.client_name || 'Client',
            serviceType: jobData.service_type || 'Service',
            scheduledDate: jobData.scheduled_date && jobData.scheduled_time 
              ? `${jobData.scheduled_date} ${jobData.scheduled_time}` 
              : new Date().toISOString(),
            pickupAddress: jobData.property_address || 'Address not provided',
            status: jobData.status || 'crew-assigned',
            propertyType: jobData.property_type || 'property',
            jobSize: jobData.job_size || 'M',
            priority: jobData.priority || 'normal',
            clientPhone: jobData.client_phone || '+44 20 7946 0958',
            specialInstructions: jobData.special_instructions || '',
            checklist: jobData.checklist || []
          };
          
          setJob(transformedJob);
          setCurrentStep('details');
          
        } catch (error) {
          console.error('Failed to fetch job details:', error);
          
          // Handle authentication errors
          if (error.message?.includes('Authentication expired')) {
            localStorage.clear();
            navigate('/login');
            return;
          }
          
          // Set job to null to show "Job Not Found" message
          setJob(null);
        }
      };
      fetchJobDetails();
    }
  }, [jobId, navigate]);

  const handleMarkArrived = () => {
    if (!job) return;
    setIsLoading(true);
    const timestamp = new Date().toISOString();
    setArrivalTime(timestamp);
    // Update local state instead of job store
    setJob(prev => prev ? { ...prev, status: 'crew-arrived' } : null);
    setTimeout(() => {
      setCurrentStep('arrived');
      setIsLoading(false);
    }, 500);
  };

  const handleBeforePhotoCapture = (photoDataUrl: string) => {
    setBeforePhotos(prev => [...prev, photoDataUrl]);
  };

  const handleAfterPhotoCapture = (photoDataUrl: string) => {
    setAfterPhotos(prev => [...prev, photoDataUrl]);
  };

  const removePhoto = (index: number, type: 'before' | 'after') => {
    if (type === 'before') {
      setBeforePhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setAfterPhotos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleStartWork = () => {
    if (!job || beforePhotos.length === 0) return;
    setIsLoading(true);
    
    // Update local state
    setJob(prev => prev ? { ...prev, status: 'in-progress' } : null);
    showStatus('job-started');
    
    setTimeout(() => {
      setCurrentStep('in-progress');
      setIsLoading(false);
    }, 500);
  };

  const handleChecklistChange = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const isChecklistComplete = checklist.every(item => item.checked);

  const handleCompleteJob = () => {
    if (!job || afterPhotos.length === 0) return;
    setIsLoading(true);
    
    // Update local state
    setJob(prev => prev ? { ...prev, status: 'work-completed' } : null);
    
    setTimeout(() => {
      setCurrentStep('completed');
      setIsLoading(false);
    }, 500);
  };

  const openLocation = () => {
    const address = encodeURIComponent(job?.pickupAddress || '');
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <XCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/crew')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/crew')} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              Dashboard
            </button>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">{job.immutableReferenceId}</h1>
              <p className="text-sm text-gray-500 capitalize">{job.serviceType.replace('-', ' ')}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentStep === 'details' ? 'bg-blue-100 text-blue-800' :
                currentStep === 'arrived' ? 'bg-green-100 text-green-800' :
                currentStep === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {currentStep === 'details' ? 'Ready' :
                 currentStep === 'arrived' ? 'Arrived' :
                 currentStep === 'in-progress' ? 'Working' : 'Complete'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1: JOB DETAILS */}
          {currentStep === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Client Information</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Name:</span> {job.clientName}</p>
                      <p><span className="text-gray-600">Service:</span> {job.serviceType.replace('-', ' ')}</p>
                      <p><span className="text-gray-600">Scheduled:</span> {new Date(job.scheduledDate).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Type:</span> {job.propertyType}</p>
                      <p><span className="text-gray-600">Size:</span> {job.jobSize}</p>
                      <p><span className="text-gray-600">Priority:</span> {job.priority}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Pickup Address</h3>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin size={20} className="text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-900">{job.pickupAddress}</p>
                      <button 
                        onClick={openLocation}
                        className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Navigation size={16} />
                        Open in Maps
                      </button>
                    </div>
                  </div>
                </div>

                {job.specialInstructions && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Special Instructions</h3>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={20} className="text-amber-600 mt-0.5" />
                        <p className="text-amber-800">{job.specialInstructions}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex gap-4">
                  <button 
                    onClick={handleMarkArrived}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle size={20} />
                    )}
                    Mark as Arrived
                  </button>
                  
                  <button 
                    onClick={() => window.open(`tel:${job.clientPhone}`, '_self')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-50"
                  >
                    <Phone size={20} />
                    Call Client
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ARRIVED */}
          {currentStep === 'arrived' && (
            <motion.div
              key="arrived"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Arrived at Location</h2>
                  <p className="text-gray-600">Take before photos to document the initial state</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Before Photos Required</h3>
                  
                  <FlexiblePhotoUpload
                    onPhotoCapture={handleBeforePhotoCapture}
                    maxPhotos={10}
                    label="Take Before Photos"
                  />

                  {beforePhotos.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Captured Photos ({beforePhotos.length})</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {beforePhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={photo} 
                              alt={`Before photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => removePhoto(index, 'before')}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleStartWork}
                  disabled={beforePhotos.length === 0 || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play size={20} />
                  )}
                  Start Work
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: IN PROGRESS */}
          {currentStep === 'in-progress' && (
            <motion.div
              key="in-progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Work in Progress</h2>
                  <p className="text-gray-600">Complete the checklist and take after photos when done</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Work Checklist</h3>
                  <div className="space-y-3">
                    {checklist.map((item) => (
                      <label key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleChecklistChange(item.id)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className={`flex-1 ${item.checked ? 'text-gray-900 line-through' : 'text-gray-700'}`}>
                          {item.label}
                        </span>
                        {item.checked && <Check size={16} className="text-green-600" />}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">After Photos</h3>
                  
                  <FlexiblePhotoUpload
                    onPhotoCapture={handleAfterPhotoCapture}
                    maxPhotos={10}
                    label="Take After Photos"
                  />

                  {afterPhotos.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Captured Photos ({afterPhotos.length})</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {afterPhotos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={photo} 
                              alt={`After photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => removePhoto(index, 'after')}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleCompleteJob}
                  disabled={!isChecklistComplete || afterPhotos.length === 0 || isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle size={20} />
                  )}
                  Complete Job
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: COMPLETED */}
          {currentStep === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Completed!</h2>
                  <p className="text-gray-600">Great work! The job has been successfully completed.</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-green-900 mb-2">Summary</h3>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>• Before photos: {beforePhotos.length}</p>
                    <p>• After photos: {afterPhotos.length}</p>
                    <p>• Checklist items completed: {checklist.filter(item => item.checked).length}/{checklist.length}</p>
                    <p>• Completed at: {new Date().toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => navigate('/crew')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    Back to Dashboard
                  </button>
                  
                  <button 
                    onClick={() => window.open(`tel:${job.clientPhone}`, '_self')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-50"
                  >
                    <Phone size={20} />
                    Call Client
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StatusPopup />
    </div>
  );
};