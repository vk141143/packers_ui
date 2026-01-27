import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, MapPin, Clock, CheckCircle, AlertCircle, Truck, Star, Award, Phone, Mail } from 'lucide-react';
import { getUnassignedJobs, getAvailableCrew, assignCrewToJob } from '../../services/authService';
import { Job } from '../../types';
import { useStatusPopup } from '../../components/common/StatusPopupManager';

export const AssignCrewModern: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const job = location.state?.job as Job | undefined;
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [availableCrew, setAvailableCrew] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showStatus, StatusPopup } = useStatusPopup();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsData, crewData] = await Promise.all([
        getUnassignedJobs().catch(() => []),
        getAvailableCrew().catch(() => [])
      ]);
      
      setJobs(jobsData || []);
      setAvailableCrew(crewData || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!job) {
      alert('No job selected. Please select a job from the Unassigned Jobs list below or navigate from the Admin Dashboard.');
      return;
    }
    
    if (selectedCrew.length === 0) {
      alert('Please select at least one crew member');
      return;
    }

    try {
      await assignCrewToJob(job.id, selectedCrew[0]); // Assign first selected crew member
      showStatus('crew-assigned');
      alert(`Successfully assigned crew to job ${job.id}`);
      navigate('/admin');
    } catch (error) {
      console.error('Failed to assign crew:', error);
      alert('Failed to assign crew to job');
    }
  };

  const toggleCrew = (id: string) => {
    setSelectedCrew(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crew and jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-green-600 to-green-800 p-8 mb-8 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <Users size={200} className="absolute -right-10 -top-10 text-white" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2">Assign Crew 👥</h2>
          <p className="text-green-100">Match the right team to the job</p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Job Details */}
        {job && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="text-green-600" />
              Job Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Job ID</p>
                  <p className="font-semibold text-gray-900">{job.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                <div className="bg-purple-600 p-3 rounded-lg">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">SLA Type</p>
                  <p className="font-semibold text-gray-900">{job.slaType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
                <div className="bg-orange-600 p-3 rounded-lg">
                  <AlertCircle size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Service</p>
                  <p className="font-semibold text-gray-900 text-sm">{job.serviceType}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Property Address</p>
              <p className="font-semibold text-gray-900">{job.propertyAddress}</p>
            </div>
          </motion.div>
        )}

        {/* Available Crew */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="text-green-600" />
            Available Crew Members
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCrew.map((crew, index) => (
              <motion.div
                key={crew.id || `crew-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCrew(crew.id)}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all ${
                  selectedCrew.includes(crew.id)
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 shadow-lg'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-green-300 hover:shadow-lg'
                }`}
              >
                {selectedCrew.includes(crew.id) && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 bg-green-600 text-white p-2 rounded-full shadow-lg"
                  >
                    <CheckCircle size={20} />
                  </motion.div>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    👷
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">{crew.full_name || crew.name || 'Crew Member'}</h4>
                    <p className="text-sm text-gray-600 mb-2">{crew.specialty || 'General'} Specialist</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-900">{crew.rating || '4.8'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={14} className="text-blue-600" />
                        <span className="text-gray-600">{crew.jobs_completed || '0'} jobs</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone size={12} />
                        {crew.phone_number || 'No phone'}
                      </p>
                    </div>

                    <div className="mt-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        ✓ Available
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Selected Crew Summary */}
        {selectedCrew.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-6 text-white"
          >
            <h3 className="text-xl font-bold mb-4">Selected Team ({selectedCrew.length})</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              {selectedCrew.map(id => {
                const crew = availableCrew.find(c => c.id === id);
                return crew ? (
                  <div key={id} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
                      👷
                    </div>
                    <span className="font-semibold">{crew.full_name || crew.name}</span>
                  </div>
                ) : null;
              })}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAssign}
              className="w-full bg-white text-green-600 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={24} />
              Assign Team to Job
            </motion.button>
          </motion.div>
        )}

        {/* Unassigned Jobs */}
        {!job && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Unassigned Jobs</h3>
            {jobs.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No unassigned jobs found</p>
                <p className="text-sm text-gray-500 mt-2">Jobs will appear here when created by clients</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 5).map(j => (
                  <motion.div
                    key={j.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate('/admin/assign-crew', { state: { job: j } })}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors border border-gray-200 hover:border-blue-300"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{j.id}</p>
                        <p className="text-sm text-gray-600">{j.propertyAddress}</p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        Needs Crew
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
      <StatusPopup />
    </div>
  );
};
