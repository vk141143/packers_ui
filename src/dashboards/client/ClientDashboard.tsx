import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, TrendingUp, CheckCircle2, AlertCircle, FileText, Loader2, Send, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import { useAnalytics } from '../../hooks/useAnalytics';
import { jobStore } from '../../store/jobStore';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { getSLAStatusBadge } from '../../utils/auditHelpers';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import { ClientFinalPaymentPopup } from '../../components/common/ClientFinalPaymentPopup';
import { UniversalCancellationFlow } from '../../components/common/UniversalCancellationFlow';
import { CancellationButton } from '../../components/common/CancellationButton';
import { Job } from '../../types';
import { useState, useEffect } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: string; direction: 'up' | 'down' };
  bgColor: string;
  iconColor: string;
  imageUrl: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, bgColor, iconColor, imageUrl }) => (
  <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
    <Card className={cn('h-full border-0 relative overflow-hidden', bgColor)}>
      <div className="absolute inset-0 opacity-50">
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-white/10" />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3 rounded-xl', iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <Badge className="gap-1 bg-white/80 text-gray-700 border-0">
              {trend.direction === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
              {trend.value}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, gradient, onClick }: {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  onClick: () => void;
}) => (
  <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
    <Card className={cn('h-full cursor-pointer border-0 text-white overflow-hidden', gradient)} onClick={onClick}>
      <CardContent className="p-6">
        <Icon className="h-8 w-8 mb-4" strokeWidth={2} />
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-white/90">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const SuggestionCard = ({ title, description, imageUrl, gradient }: {
  title: string;
  description: string;
  imageUrl: string;
  gradient: string;
}) => (
  <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="relative rounded-xl overflow-hidden h-56 cursor-pointer group">
    <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    <div className={cn('absolute inset-0', gradient)} />
    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-sm text-white/90 mb-4">{description}</p>
      <button className="bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition-all">Learn More</button>
    </div>
  </motion.div>
);

const ActiveJobCard = ({ job, onClick }: {
  job: Job;
  onClick: () => void;
}) => {
  const slaStatus = getSLAStatusBadge(job);
  const slaColors = { green: 'bg-green-100 text-green-700', orange: 'bg-orange-100 text-orange-700', red: 'bg-red-100 text-red-700' };

  return (
    <motion.div whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
      <Card className="h-full cursor-pointer hover:border-blue-500/50 transition-colors" onClick={onClick}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <Badge className="font-bold bg-blue-100 text-blue-700 border-0">{job.id}</Badge>
            <Badge className={cn('font-bold border-0', slaColors[slaStatus.color as keyof typeof slaColors])}>{slaStatus.label}</Badge>
          </div>
          <h3 className="font-semibold text-base mb-3">{job.serviceType?.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Service Type Not Available'}</h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="truncate">{job.propertyAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>{formatDate(job.scheduledDate)}</span>
            </div>
            {job.propertySize && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-600">🏠</span>
                <span>{job.propertySize.replace('-', ' ')}</span>
              </div>
            )}
            {job.vanLoads && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-600">🚚</span>
                <span>{job.vanLoads} van load{job.vanLoads !== '1' ? 's' : ''}</span>
              </div>
            )}
            {job.urgency && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-blue-600">{job.urgency === 'emergency' ? '🚨' : job.urgency === 'urgent' ? '⚡' : '📅'}</span>
                <span className="capitalize">{job.urgency} priority</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-xs text-gray-600">Estimated</span>
            <span className="text-lg font-bold">{formatCurrency(job.estimatedValue)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CompletedJobCard = ({ job, onClick }: {
  job: Job;
  onClick: () => void;
}) => (
  <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="relative rounded-xl overflow-hidden h-64 cursor-pointer group" onClick={onClick}>
    <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop" alt="Completed" className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-300" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
    <div className="absolute top-4 left-4">
      <Badge className="font-semibold bg-white/90 text-gray-900 border-0">{job.id}</Badge>
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(job.scheduledDate)}</span>
        </div>
        {job.propertySize && (
          <div className="flex items-center gap-2 text-sm">
            <span>🏠</span>
            <span>{job.propertySize.replace('-', ' ')}</span>
          </div>
        )}
        {job.vanLoads && (
          <div className="flex items-center gap-2 text-sm">
            <span>🚚</span>
            <span>{job.vanLoads} van load{job.vanLoads !== '1' ? 's' : ''}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <Badge className="bg-green-600 text-white hover:bg-green-700 border-0">Completed</Badge>
        <span className="text-lg font-bold">{formatCurrency(job.actualCost || job.estimatedValue)}</span>
      </div>
    </div>
  </motion.div>
);

export const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: jobs = [], isLoading, error } = useJobs();
  const { data: analytics } = useAnalytics();
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPaymentJob, setSelectedPaymentJob] = useState<Job | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelJob, setSelectedCancelJob] = useState<Job | null>(null);

  // Check for new jobs with final price that need payment
  useEffect(() => {
    const jobsWithNewFinalPrice = jobs.filter((j: Job) => 
      j.clientId === '1' &&
      (j.status === 'admin-verified' || j.finalPrice) && 
      j.paymentStatus !== 'success' &&
      !j.invoiceId &&
      (j.finalAmountSentAt || j.verifiedAt)
    );
    
    if (jobsWithNewFinalPrice.length > 0 && !showPaymentPopup) {
      setSelectedPaymentJob(jobsWithNewFinalPrice[0]);
      setShowPaymentPopup(true);
    }
  }, [jobs, showPaymentPopup]);

  const handleCancelBooking = (job: Job) => {
    setSelectedCancelJob(job);
    setShowCancelModal(true);
  };

  const handleCancelSuccess = () => {
    setShowCancelModal(false);
    setSelectedCancelJob(null);
    window.location.reload();
  };

  const handlePaymentSuccess = (paymentData: { paidAt: string; paymentId: string }) => {
    if (selectedPaymentJob) {
      // Update the job with payment success
      const updatedJob = {
        ...selectedPaymentJob,
        paymentStatus: 'success' as const,
        paidAt: paymentData.paidAt,
        paymentId: paymentData.paymentId
      };
      
      // Update job store
      jobStore.updateJob(updatedJob);
    }
    
    setShowPaymentPopup(false);
    setSelectedPaymentJob(null);
    
    // Show success message
    alert('✅ Payment successful! Admin will verify and generate your invoice shortly.');
  };

  // Filter jobs based on client ID
  const activeJobs = (jobs || []).filter((j: Job) => {
    const matches = j.clientId === '1' &&
      j.lifecycleState !== 'invoiced' && 
      j.status !== 'cancelled' &&
      j.status !== 'admin-verified' &&
      !j.finalPrice;
    
    return matches;
  });
  
  const pendingPaymentJobs = (jobs || []).filter((j: Job) => {
    const matches = j.clientId === '1' &&
      (j.status === 'admin-verified' || j.finalPrice) && 
      j.paymentStatus !== 'success' &&
      !j.invoiceId;
    
    return matches;
  });
  
  const completedJobs = (jobs || []).filter((j: Job) => {
    const matches = j.clientId === '1' &&
      j.lifecycleState === 'invoiced';
    
    return matches;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load dashboard</h2>
          <p className="text-gray-600 mb-4">There was an error loading your dashboard data.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🌅 Good Morning, Client 👋</h1>
          <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin className="h-4 w-4" />🇬🇧 London, {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} hrs - Your complete property clearance dashboard</p>
        </motion.div>
      </div>

      <div className="px-6 py-8 space-y-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <h2 className="text-xl font-semibold mb-4">📊 Your Property Services Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="📋 Pending Quotes" 
              value={jobs.filter((j: Job) => j.clientId === '1' && j.status === 'admin-quoted').length} 
              icon={FileText} 
              trend={analytics?.activeJobsTrend || { value: '+0%', direction: 'up' }} 
              bgColor="bg-blue-50" 
              iconColor="bg-blue-100 text-blue-600" 
              imageUrl="https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop" 
            />
            <StatCard 
              title="💰 Payment Required" 
              value={pendingPaymentJobs.length} 
              icon={CheckCircle2} 
              trend={analytics?.completedTrend || { value: '+0%', direction: 'up' }} 
              bgColor="bg-red-50" 
              iconColor="bg-red-100 text-red-600" 
              imageUrl="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop" 
            />
            <StatCard 
              title="📊 Active Jobs" 
              value={activeJobs.length} 
              icon={AlertCircle} 
              trend={analytics?.slaTrend || { value: '+2%', direction: 'up' }} 
              bgColor="bg-green-50" 
              iconColor="bg-green-100 text-green-600" 
              imageUrl="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop" 
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h2 className="text-xl font-semibold mb-4">🚀 Quick Actions - What would you like to do?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <QuickActionCard title="📋 Request Booking" description="Step 1: Submit new booking request" icon={Send} gradient="bg-gradient-to-br from-green-600 to-green-700" onClick={() => navigate('/client/request-booking')} />
            <QuickActionCard title="📄 Quote Approval" description="Step 4: Review and approve quotes" icon={CheckCircle2} gradient="bg-gradient-to-br from-blue-600 to-blue-700" onClick={() => navigate('/client/quotes')} />
            <QuickActionCard title="💰 Payment" description="Step 5: Deposit collection" icon={DollarSign} gradient="bg-gradient-to-br from-orange-600 to-orange-700" onClick={() => navigate('/client/payment')} />
            <QuickActionCard title="📊 Job Tracking" description="Monitor job progress" icon={MapPin} gradient="bg-gradient-to-br from-purple-600 to-purple-700" onClick={() => navigate('/client/tracking')} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <h2 className="text-xl font-semibold mb-4">💡 Helpful Resources - Tips & Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SuggestionCard title="📦 Packing Tips" description="Expert advice for safe moving" imageUrl="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=300&fit=crop" gradient="bg-gradient-to-t from-blue-800/80 to-transparent" />
            <SuggestionCard title="🚨 Emergency Clearance" description="24h rapid response service" imageUrl="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=300&fit=crop" gradient="bg-gradient-to-t from-red-800/80 to-transparent" />
            <SuggestionCard title="🏠 Property Turnover" description="Complete clearance solutions" imageUrl="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=300&fit=crop" gradient="bg-gradient-to-t from-green-800/80 to-transparent" />
          </div>
        </motion.div>

        {pendingPaymentJobs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-red-600">⚠️ Payment Required - Action Needed</h2>
              <button onClick={() => navigate('/client/history')} className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-2">View All <ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingPaymentJobs.slice(0, 3).map(job => (
                <motion.div key={job.id} whileHover={{ scale: 1.03 }} className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6 cursor-pointer" onClick={() => {
                  setSelectedPaymentJob(job);
                  setShowPaymentPopup(true);
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="font-bold bg-white/20 text-white border-0">{job.id}</Badge>
                    <Badge className="font-bold bg-white text-red-600 border-0">
                      {job.status === 'admin-verified' ? 'Verified - Pay Now' : 'Payment Due'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{job.serviceType?.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-red-100">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{job.propertyAddress}</span>
                    </div>
                    {job.propertySize && (
                      <div className="flex items-center gap-2 text-sm text-red-100">
                        <span>🏠</span>
                        <span>{job.propertySize.replace('-', ' ')}</span>
                      </div>
                    )}
                    {job.vanLoads && (
                      <div className="flex items-center gap-2 text-sm text-red-100">
                        <span>🚚</span>
                        <span>{job.vanLoads} van load{job.vanLoads !== '1' ? 's' : ''}</span>
                      </div>
                    )}
                    {job.wasteTypes && job.wasteTypes.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-red-100">
                        <span>🗑️</span>
                        <span>{job.wasteTypes.slice(0, 2).join(', ')}{job.wasteTypes.length > 2 ? ` +${job.wasteTypes.length - 2} more` : ''}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <span className="text-sm text-red-100">Final Amount</span>
                    <span className="text-2xl font-bold">{formatCurrency(job.verifiedFinalPrice || job.finalPrice)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPaymentJob(job);
                      setShowPaymentPopup(true);
                    }}
                    className="w-full mt-4 bg-white text-red-600 py-2 px-4 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <DollarSign size={18} />
                    Pay Now
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeJobs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">🚚 Active Jobs - Currently in Progress</h2>
              <button onClick={() => navigate('/client/history')} className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">View All <ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeJobs.slice(0, 3).map(job => <ActiveJobCard key={job.id} job={job} onClick={() => navigate(`/client/track/${job.id}`)} />)}
            </div>
          </motion.div>
        )}

        {completedJobs.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">✅ Recently Completed - Well Done!</h2>
              <button onClick={() => navigate('/client/history')} className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">View All <ArrowRight className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {completedJobs.slice(0, 3).map(job => <CompletedJobCard key={job.id} job={job} onClick={() => navigate('/client/history')} />)}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Payment Popup */}
      {selectedPaymentJob && (
        <ClientFinalPaymentPopup
          job={selectedPaymentJob}
          isOpen={showPaymentPopup}
          onClose={() => {
            setShowPaymentPopup(false);
            setSelectedPaymentJob(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Cancel Booking Modal */}
      {selectedCancelJob && (
        <UniversalCancellationFlow
          job={selectedCancelJob}
          userRole="client"
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedCancelJob(null);
          }}
          onSuccess={(result) => {
            setShowCancelModal(false);
            setSelectedCancelJob(null);
            alert(`✅ Booking cancelled successfully! Refund of £${result.refundAmount} will be processed within 5-7 business days.`);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};
