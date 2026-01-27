import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, MapPin, CheckCircle2, Clock, Users, Navigation } from 'lucide-react';
import { Job, JobStatus } from '../../types';
import { StatusBadge } from './StatusBadge';
import { formatDateTime } from '../../utils/helpers';

interface TrackingStep {
  id: number;
  status: JobStatus;
  title: string;
  description: string;
  timestamp?: string;
  location?: string;
  stepStatus: 'completed' | 'active' | 'pending';
  icon: React.ReactNode;
}

interface JobTrackingTimelineProps {
  job: Job;
}

export const JobTrackingTimeline: React.FC<JobTrackingTimelineProps> = ({ job }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getTrackingSteps = (): TrackingStep[] => {
    const statusOrder: JobStatus[] = ['created', 'dispatched', 'at-pickup', 'packing', 'in-transit', 'at-delivery', 'unloading', 'completed'];
    const currentIndex = statusOrder.indexOf(job.status);

    return [
      {
        id: 1,
        status: 'created',
        title: 'Job Created',
        description: 'Booking confirmed and scheduled',
        timestamp: job.createdAt,
        location: 'System',
        stepStatus: currentIndex >= 0 ? 'completed' : 'pending',
        icon: <Package className="w-5 h-5" />,
      },
      {
        id: 2,
        status: 'dispatched',
        title: 'Crew Dispatched',
        description: job.crewAssigned ? `Crew: ${job.crewAssigned.join(', ')}` : 'Crew assigned to job',
        timestamp: job.dispatchedAt,
        location: 'En route',
        stepStatus: currentIndex >= 1 ? (currentIndex === 1 ? 'active' : 'completed') : 'pending',
        icon: <Users className="w-5 h-5" />,
      },
      {
        id: 3,
        status: 'at-pickup',
        title: 'Arrived at Property',
        description: 'Crew arrived at pickup location',
        timestamp: job.startedAt,
        location: job.pickupAddress,
        stepStatus: currentIndex >= 2 ? (currentIndex === 2 ? 'active' : 'completed') : 'pending',
        icon: <MapPin className="w-5 h-5" />,
      },
      {
        id: 4,
        status: 'packing',
        title: 'Packing in Progress',
        description: 'Items being packed and prepared',
        location: job.pickupAddress,
        stepStatus: currentIndex >= 3 ? (currentIndex === 3 ? 'active' : 'completed') : 'pending',
        icon: <Package className="w-5 h-5" />,
      },
      {
        id: 5,
        status: 'in-transit',
        title: 'In Transit',
        description: 'Moving to delivery location',
        location: 'On the road',
        stepStatus: currentIndex >= 4 ? (currentIndex === 4 ? 'active' : 'completed') : 'pending',
        icon: <Truck className="w-5 h-5" />,
      },
      {
        id: 6,
        status: 'at-delivery',
        title: 'At Destination',
        description: 'Crew arrived at destination',
        location: job.pickupAddress,
        stepStatus: currentIndex >= 5 ? (currentIndex === 5 ? 'active' : 'completed') : 'pending',
        icon: <MapPin className="w-5 h-5" />,
      },
      {
        id: 7,
        status: 'unloading',
        title: 'Unloading',
        description: 'Items being unloaded',
        location: job.pickupAddress,
        stepStatus: currentIndex >= 6 ? (currentIndex === 6 ? 'active' : 'completed') : 'pending',
        icon: <Package className="w-5 h-5" />,
      },
      {
        id: 8,
        status: 'completed',
        title: 'Job Completed',
        description: 'Successfully completed',
        timestamp: job.completedAt,
        location: job.pickupAddress,
        stepStatus: currentIndex >= 7 ? 'completed' : 'pending',
        icon: <CheckCircle2 className="w-5 h-5" />,
      },
    ];
  };

  const steps = getTrackingSteps();
  const activeStep = steps.findIndex(s => s.stepStatus === 'active');

  useEffect(() => {
    setActiveStepIndex(activeStep >= 0 ? activeStep : steps.filter(s => s.stepStatus === 'completed').length - 1);
  }, [job.status]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg border-2 border-gray-100"
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Job Tracking</h2>
              <p className="text-gray-600 mt-1">Real-time updates on your property clearance</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg w-fit">
              <Clock className="w-4 h-4 text-blue-600" />
              <StatusBadge status={job.status} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Job ID</p>
              <p className="font-mono font-semibold text-gray-900">{job.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Service Type</p>
              <p className="font-semibold text-gray-900 capitalize">{job.serviceType.replace(/-/g, ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">SLA Deadline</p>
              <p className="font-semibold text-gray-900">{formatDateTime(job.slaDeadline)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="relative">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(step.stepStatus)} text-white relative z-10`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                >
                  {step.stepStatus === 'active' && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue-500"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  {step.icon}
                </motion.div>
              </div>
            ))}
          </div>
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-0">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Timeline Steps */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div
                className={`bg-white rounded-xl shadow-lg transition-all duration-300 ${
                  step.stepStatus === 'active' ? 'border-2 border-blue-500 shadow-blue-500/20' : 'border border-gray-100'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(step.stepStatus)} text-white flex-shrink-0`}
                      animate={
                        step.stepStatus === 'active' && isAnimating
                          ? { rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      {step.icon}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                          step.stepStatus === 'completed' ? 'bg-green-100 text-green-700' :
                          step.stepStatus === 'active' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {step.stepStatus}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                        {step.timestamp && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDateTime(step.timestamp)}</span>
                          </div>
                        )}
                        {step.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{step.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
