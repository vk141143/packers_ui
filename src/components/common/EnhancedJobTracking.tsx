import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, MapPin, CheckCircle2, Users, Clock, Phone, Mail, XCircle } from 'lucide-react';
import { Job, JobStatus } from '../../types';
import { formatDateTime, formatCurrency } from '../../utils/helpers';
import { cancelJobRequest, submitJobRating, getJobRating } from '../../services/api';
import { crewMembers } from '../../data/mockData';
import { jobStore } from '../../store/jobStore';

interface CircleProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

const CircleProgress: React.FC<CircleProgressProps> = ({ value, size = 80, strokeWidth = 6 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - animatedValue / 100);

  useEffect(() => {
    const start = performance.now();
    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / 300, 1);
      setAnimatedValue(value * progress);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={radius} className="fill-transparent stroke-gray-200" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        className="fill-transparent"
        stroke="url(#progress-gradient)"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        strokeLinecap="round"
      />
    </svg>
  );
};

const TextShimmer: React.FC<{ children: string }> = ({ children }) => (
  <motion.p
    className="text-sm font-medium bg-gradient-to-r from-gray-400 via-gray-900 to-gray-400 bg-[length:250%_100%] bg-clip-text text-transparent"
    animate={{ backgroundPosition: ['100% center', '0% center'] }}
    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
  >
    {children}
  </motion.p>
);

interface EnhancedJobTrackingProps {
  job: Job;
}

export const EnhancedJobTracking: React.FC<EnhancedJobTrackingProps> = ({ job }) => {
  const [clientRating, setClientRating] = useState<number | null>(null);
  const [ratingComment, setRatingComment] = useState('');
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [serverRating, setServerRating] = useState<any | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  
  // Get crew details from crewIds
  const assignedCrew = job.crewIds?.map(crewId => 
    crewMembers.find(crew => crew.id === crewId)
  ).filter(Boolean) || [];

  // Derive a stable job identifier for API calls — some backend responses may use different keys
  // include snake_case variants like job_id / job_identifier which some APIs return
  const jobIdentifier = (job && (
    job.id || job.jobId || (job as any).job_id || (job as any).job_identifier || job.immutableReferenceId || (job as any)._id || (job as any).immutable_id
  )) || null;

  // Normalize status and OTP flags (backend may use snake_case keys)
  const normalizedStatus: string = (job && (
    job.status || (job as any).job_status || (job as any).jobStatus || (job as any).status
  )) || '';

  const otpVerifiedFlag: boolean = Boolean((job && (job as any).otpVerified) || (job && (job as any).otp_verified));

  // Check if cancellation is allowed (before OTP verification)
  const canCancel = normalizedStatus !== 'otp-verified' && 
                    normalizedStatus !== 'clearance-progress' && 
                    normalizedStatus !== 'after-photos' && 
                    normalizedStatus !== 'work-completed' && 
                    normalizedStatus !== 'completed' && 
                    normalizedStatus !== 'cancelled' && 
                    normalizedStatus !== 'refunded' &&
                    !otpVerifiedFlag;

  const handleCancelBooking = () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a cancellation reason');
      return;
    }

    // Debug: log job shape and resolved identifier to troubleshoot missing id
    console.log('[EnhancedJobTracking] handleCancelBooking - job:', job);
    console.log('[EnhancedJobTracking] handleCancelBooking - jobIdentifier:', jobIdentifier);

    if (!jobIdentifier) {
      alert('Unable to cancel booking: job identifier is missing.');
      return;
    }

    // Use async flow to call server cancel endpoint
    (async () => {
      setIsProcessing(true);
      try {
        const resp = await cancelJobRequest(jobIdentifier as string, cancellationReason);
        if (!resp.success) {
          if (String(resp.error).includes('401')) {
            alert('Session expired. Please login again.');
            navigate('/login');
            return;
          }
          throw new Error(resp.error || 'Cancel failed');
        }

        // Update local store to reflect cancellation/refund
        const updatedJob = {
          ...job,
          status: 'refunded' as JobStatus,
          refundStatus: 'processed' as const,
          refundAmount: job.estimatedValue,
          refundedAt: new Date().toISOString(),
          cancellationReason,
          cancelledBy: 'Client',
          cancelledAt: new Date().toISOString(),
          statusHistory: [
            ...(job.statusHistory || []),
            {
              status: 'cancelled',
              timestamp: new Date().toISOString(),
              updatedBy: 'Client',
              notes: `Booking cancelled: ${cancellationReason}`
            },
            {
              status: 'refunded',
              timestamp: new Date().toISOString(),
              updatedBy: 'System',
              notes: `Refund processed: ${formatCurrency(job.estimatedValue || job.price || 0)}`
            }
          ]
        };

        jobStore.updateJob(updatedJob);
        setIsProcessing(false);
        setShowCancelModal(false);
        alert(`Booking cancelled successfully! Refund of ${formatCurrency(job.estimatedValue || job.price || 0)} will be processed within 5-7 business days.`);
      } catch (err: any) {
        setIsProcessing(false);
        alert('Failed to cancel booking: ' + (err?.message || 'Unknown error'));
      }
    })();
  };

  const steps = [
    { status: 'created', title: 'Job Created', description: 'Booking created by client', location: 'System', icon: Package },
    { status: 'crew-assigned', title: 'Crew Assigned', description: job.crewAssigned ? `Auto-assigned crew: ${job.crewAssigned.join(', ')}` : 'Crew auto-assigned', location: 'System', icon: Users },
    { status: 'crew-dispatched', title: 'Crew Dispatched', description: 'Crew traveling to location', location: 'En route', icon: Truck },
    { status: 'crew-arrived', title: 'Crew Arrived', description: 'Crew arrived at property', location: job.pickupAddress, icon: MapPin },
    { status: 'before-photos', title: 'Before Photos', description: 'Taking before photos', location: job.pickupAddress, icon: Package },
    { status: 'clearance-progress', title: 'Clearance in Progress', description: 'Property clearance underway', location: job.pickupAddress, icon: Package },
    { status: 'after-photos', title: 'After Photos', description: 'Taking after photos', location: job.pickupAddress, icon: Package },
    { status: 'work-completed', title: 'Work Completed', description: 'Clearance work finished', location: job.pickupAddress, icon: CheckCircle2 },
    { status: 'pending-verification', title: 'Pending Verification', description: 'Awaiting admin verification', location: 'Admin Review', icon: Clock },
    { status: 'admin-verified', title: 'Admin Verified', description: 'Work verified by admin', location: 'System', icon: CheckCircle2 },
    { status: 'invoice-generated', title: 'Invoice Generated', description: 'Invoice created and sent', location: 'System', icon: Package },
    { status: 'completed', title: 'Job Completed', description: 'Job fully completed', location: 'System', icon: CheckCircle2 },
  ];

  // If job is cancelled/refunded, show steps up to cancellation + cancelled step
  const isCancelled = normalizedStatus === 'cancelled' || normalizedStatus === 'refunded';
  
  const statusOrder: JobStatus[] = [
    'created', 
    'crew-assigned', 
    'crew-dispatched', 
    'crew-arrived', 
    'before-photos', 
    'clearance-progress', 
    'after-photos', 
    'work-completed', 
    'pending-verification', 
    'admin-verified', 
    'invoice-generated', 
    'completed'
  ];
  
  let displaySteps = steps;
  let activeIndex = statusOrder.indexOf(normalizedStatus as JobStatus);
  
  if (isCancelled) {
    // Find the last completed step before cancellation
    const lastCompletedStatus = job.statusHistory && job.statusHistory.length > 2 
      ? job.statusHistory[job.statusHistory.length - 3]?.status 
      : 'crew-dispatched';
    
    const lastIndex = statusOrder.indexOf(lastCompletedStatus as JobStatus);
    displaySteps = steps.slice(0, lastIndex + 1);
    
    // Add cancelled step
    displaySteps.push({
      status: 'cancelled',
      title: 'Booking Cancelled',
      description: job.cancellationReason || 'Booking cancelled by client',
      location: 'System',
      icon: XCircle
    });
    
    activeIndex = displaySteps.length - 1;
  }

  useEffect(() => {
    setCurrentStepIndex(activeIndex >= 0 ? activeIndex : 0);
  }, [activeIndex]);

  // Fetch existing rating from server when job completed
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (normalizedStatus !== 'completed') return;
      // if local job already has a clientRating, skip
      if ((job as any).clientRating) return;
      if (!jobIdentifier) return;
      try {
        const resp = await getJobRating(jobIdentifier as string);
        if (!mounted) return;
        if (!resp.success) {
          if (String(resp.error).includes('401')) {
            // token invalid — user must re-login; do not show form
            console.warn('Rating fetch returned 401');
            return;
          }
          // no rating or other error
          return;
        }

        const data = resp.data;
        if (data) {
          setServerRating(data);
          // also update local store so UI across app reflects it
          const updatedJob = {
            ...job,
            clientRating: data,
          } as any;
          jobStore.updateJob(updatedJob);
        }
      } catch (err) {
        console.error('Failed to fetch job rating', err);
      }
    })();
    return () => { mounted = false; };
  }, [jobIdentifier, job.status]);

  const progress = ((currentStepIndex + 1) / displaySteps.length) * 100;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent mb-2">
          Track Your Job
        </h1>
        <p className="text-gray-600">Real-time updates on your property clearance</p>
      </motion.div>

      {/* Cancellation Notice */}
      {(job.status === 'cancelled' || job.status === 'refunded') && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="bg-red-600 p-3 rounded-xl">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-900 mb-2">Booking Cancelled</h3>
              <p className="text-red-700 mb-2">{job.cancellationReason}</p>
              {job.refundStatus === 'processed' && (
                <div className="bg-white border border-red-200 rounded-lg p-4 mt-3">
                  <p className="text-sm text-gray-600 mb-1">Refund Status: <span className="font-bold text-green-600">Processed</span></p>
                  <p className="text-sm text-gray-600">Amount: <span className="font-bold">{job.refundAmount ? formatCurrency(job.refundAmount) : '-'}</span></p>
                  <p className="text-xs text-gray-500 mt-2">Refunded on {job.refundedAt && formatDateTime(job.refundedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Cancel Button */}
      {canCancel && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Need to cancel?</h3>
              <p className="text-sm text-gray-600">You can cancel before crew enters the OTP and get a full refund</p>
            </div>
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              <XCircle size={20} />
              Cancel Booking
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{job.id}</h2>
            <TextShimmer>Updating status...</TextShimmer>
          </div>
          <div className="flex items-center gap-4">
            <CircleProgress value={progress} />
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{Math.round(progress)}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
          <motion.div
            className={`absolute left-8 top-0 w-0.5 ${
              isCancelled 
                ? 'bg-gradient-to-b from-blue-600 via-blue-500 to-red-600'
                : 'bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400'
            }`}
            initial={{ height: 0 }}
            animate={{ height: `${(currentStepIndex / (displaySteps.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          <div className="space-y-8">
            {displaySteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <motion.div
                  key={step.status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-6"
                >
                  <motion.div
                    animate={{
                      scale: isCurrent ? [1, 1.2, 1] : 1,
                      rotate: isCurrent ? [0, 360] : 0,
                    }}
                    transition={{ duration: 2, repeat: isCurrent ? Infinity : 0, ease: 'easeInOut' }}
                    className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 transition-all ${
                      isActive 
                        ? step.status === 'cancelled'
                          ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/50'
                          : 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/50'
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>

                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0.5, y: isCurrent ? [0, -5, 0] : 0 }}
                    transition={{ duration: 2, repeat: isCurrent ? Infinity : 0, ease: 'easeInOut' }}
                    className={`flex-1 pb-8 transition-all ${
                      isCurrent 
                        ? step.status === 'cancelled'
                          ? 'bg-red-50 -ml-4 pl-4 pr-4 py-4 rounded-lg'
                          : 'bg-blue-50 -ml-4 pl-4 pr-4 py-4 rounded-lg'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-xl font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</h3>
                      {isCurrent && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-full"
                        >
                          Current
                        </motion.span>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>{step.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {step.location}
                      </span>
                      {job.createdAt && index === 0 && <span>{formatDateTime(job.createdAt)}</span>}
                      {job.dispatchedAt && index === 1 && <span>{formatDateTime(job.dispatchedAt)}</span>}
                      {job.completedAt && index === steps.length - 1 && <span>{formatDateTime(job.completedAt)}</span>}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
      >
        <h3 className="text-lg font-semibold mb-4">SLA Deadline</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {job.status === 'completed' ? 'Completed!' : formatDateTime(job.slaDeadline)}
            </p>
            <p className="text-sm text-gray-600">
              {job.status === 'completed' ? 'Job successfully finished' : `${job.slaType} service level`}
            </p>
          </div>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <Truck className="w-12 h-12 text-blue-600" />
          </motion.div>
        </div>
      </motion.div>

      {assignedCrew.length > 0 && !isCancelled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Assigned Crew Team</h3>
              <p className="text-sm text-gray-600">Your dedicated property clearance specialists</p>
            </div>
          </div>
          <div className="space-y-4">
            {assignedCrew.map((crew: any) => (
              <div key={crew.id} className="bg-white border border-blue-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <img 
                    src={crew.avatar} 
                    alt={crew.name}
                    className="w-16 h-16 rounded-xl shadow-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{crew.name}</h4>
                        <p className="text-sm text-blue-600 font-semibold">{crew.specialty} Specialist</p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        ⭐ {crew.rating}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-blue-600" />
                        <a href={`tel:${crew.phone}`} className="hover:text-blue-600">{crew.phone}</a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-blue-600" />
                        <a href={`mailto:${crew.email}`} className="truncate hover:text-blue-600">{crew.email}</a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-blue-600" />
                        <span>{crew.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck size={14} className="text-blue-600" />
                        <span>{crew.vehicleType}</span>
                      </div>
                    </div>
                    {crew.certifications && crew.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {crew.certifications.map((cert: string) => (
                          <span key={cert} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                            ✓ {cert}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">📦 {crew.jobs} jobs completed</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Customer/Client Contact Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-600 p-3 rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Customer Details</h3>
            <p className="text-sm text-gray-600">Contact information for this booking</p>
          </div>
        </div>
        <div className="bg-white border border-green-100 rounded-xl p-5 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Client</p>
              <p className="font-bold text-gray-900">{job.clientName || job.client_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Service</p>
              <p className="font-semibold text-gray-900">{job.serviceType?.replace(/-/g, ' ') || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">SLA</p>
              <p className="font-semibold text-gray-900">{job.slaType || 'Standard'} response</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Value</p>
              <p className="font-bold text-green-600">£{(job.estimatedValue || job.price || 0).toLocaleString()}</p>
            </div>
            {job.clientDetails && (
              <>
                {job.clientDetails.phone && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Contact Phone</p>
                    <a href={`tel:${job.clientDetails.phone}`} className="flex items-center gap-2 text-sm text-gray-900 hover:text-green-600">
                      <Phone size={14} className="text-green-600" />
                      <span className="font-semibold">{job.clientDetails.phone}</span>
                    </a>
                  </div>
                )}
                {job.clientDetails.email && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Contact Email</p>
                    <a href={`mailto:${job.clientDetails.email}`} className="flex items-center gap-2 text-sm text-gray-900 hover:text-green-600">
                      <Mail size={14} className="text-green-600" />
                      <span className="font-semibold">{job.clientDetails.email}</span>
                    </a>
                  </div>
                )}
                {job.clientDetails.contactPerson && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Contact Person</p>
                    <p className="font-semibold text-gray-900">{job.clientDetails.contactPerson}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Payment Status */}
      {job.paymentStatus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-2 rounded-2xl p-6 shadow-lg ${
            job.paymentStatus === 'success' 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
              : job.paymentStatus === 'failed'
              ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
              : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${
              job.paymentStatus === 'success' ? 'bg-green-600' : job.paymentStatus === 'failed' ? 'bg-red-600' : 'bg-yellow-600'
            }`}>
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Payment Status</h3>
              <p className="text-sm text-gray-600">Transaction details</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  job.paymentStatus === 'success' 
                    ? 'bg-green-100 text-green-700'
                    : job.paymentStatus === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {job.paymentStatus === 'success' ? '✓ Paid' : job.paymentStatus === 'failed' ? '✗ Failed' : '⏳ Pending'}
                </span>
              </div>
              {job.paymentMethod && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Method</p>
                  <p className="font-semibold text-gray-900 capitalize">{job.paymentMethod.replace('-', ' ')}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="font-bold text-gray-900">{formatCurrency(job.estimatedValue || job.price || 0)}</p>
              </div>
              {job.paidAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Paid At</p>
                  <p className="font-semibold text-gray-900">{formatDateTime(job.paidAt)}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Client rating (post-completion) */}
      {job.status === 'completed' && !(job as any).clientRating && !serverRating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-md"
        >
          <h3 className="text-lg font-semibold mb-3">Rate the Crew</h3>
          <p className="text-sm text-gray-600 mb-4">Share feedback to help improve our service.</p>
          <div className="flex items-center gap-3 mb-3">
            {[1,2,3,4,5].map((s) => (
              <button
                key={s}
                onClick={() => setClientRating(s)}
                className={`px-3 py-2 rounded-md text-sm font-semibold ${clientRating && clientRating >= s ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-700'} transition-all`}
              >
                {s} ★
              </button>
            ))}
          </div>
          <textarea
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
            placeholder="Write an optional comment (what went well, what could improve)"
            className="w-full border border-gray-200 rounded-md p-3 mb-4"
            rows={3}
          />
          <div className="flex gap-3">
            <button
              onClick={async () => {
                if (!clientRating) { alert('Please select a rating (1-5)'); return; }
                setIsRatingSubmitting(true);
                try {
                  const primaryCrewId = assignedCrew[0]?.id;
                  const resp = await submitJobRating(jobIdentifier as string, clientRating, ratingComment || undefined, primaryCrewId);
                  if (!resp.success) {
                    if (String(resp.error).includes('401')) {
                      alert('Session expired. Please login again.');
                      navigate('/login');
                      return;
                    }
                    throw new Error(resp.error || 'Rating submission failed');
                  }

                  // Update local job to record the client rating
                  const updatedJob = {
                    ...job,
                    clientRating: { rating: clientRating, comment: ratingComment || '', submittedAt: new Date().toISOString() } as any,
                    statusHistory: [
                      ...(job.statusHistory || []),
                      { status: 'client-rated', timestamp: new Date().toISOString(), updatedBy: 'Client', notes: `Rating: ${clientRating}` }
                    ]
                  };
                  jobStore.updateJob(updatedJob);
                  setIsRatingSubmitting(false);
                  alert('Thanks for your feedback!');
                } catch (err: any) {
                  setIsRatingSubmitting(false);
                  alert('Failed to submit rating: ' + (err?.message || 'Unknown error'));
                }
              }}
              disabled={isRatingSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isRatingSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
            <button
              onClick={() => { setClientRating(null); setRatingComment(''); }}
              disabled={isRatingSubmitting}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}

      {/* Show existing rating from server if present */}
      {serverRating && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-2">Your rating</h3>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-400 text-white px-3 py-2 rounded-md font-bold">{serverRating.rating} ★</div>
            <div className="text-sm text-gray-700">Submitted {serverRating.submittedAt ? new Date(serverRating.submittedAt).toLocaleString() : ''}</div>
          </div>
          {serverRating.comment && <p className="text-sm text-gray-600">{serverRating.comment}</p>}
        </motion.div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => !isProcessing && setShowCancelModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Cancel Booking</h3>
              <p className="text-gray-600">Are you sure you want to cancel this booking?</p>
              <p className="text-xs text-gray-500 mt-2">Job ID: <span className="font-mono text-sm">{jobIdentifier || 'N/A'}</span></p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-900 font-semibold mb-2">Refund Information</p>
              <p className="text-sm text-blue-700">Full refund of <span className="font-bold">{formatCurrency(job.estimatedValue || job.price || 0)}</span> will be processed within 5-7 business days</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for cancellation *</label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
                placeholder="Please tell us why you're cancelling..."
                disabled={isProcessing}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle size={20} />
                    Confirm Cancel
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
