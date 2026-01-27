import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Package, ArrowRight, Truck, Camera, Sparkles, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti, type ConfettiRef } from '../components/common/Confetti';
import { authStore } from '../store/authStore';
import { AddressInput } from '../components/common/AddressInput';
import { createJobDraft } from '../services/api';

export const PublicBooking: React.FC = () => {
  const navigate = useNavigate();
  const confettiRef = useRef<ConfettiRef>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: '',
    propertyAddress: '',
    scheduledDate: '',
    slaType: '48h',
    photos: [] as File[],
  });
  const [errors, setErrors] = useState({
    serviceType: '',
    propertyAddress: '',
    scheduledDate: '',
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    const newErrors = {
      serviceType: !formData.serviceType ? 'Please select a service type' : '',
      propertyAddress: !formData.propertyAddress.trim() ? 'Property address is required' : '',
      scheduledDate: !formData.scheduledDate ? 'Please select a date' : '',
    };

    // Check if date is in the past
    if (formData.scheduledDate && new Date(formData.scheduledDate) < new Date()) {
      newErrors.scheduledDate = 'Date cannot be in the past';
    }

    setErrors(newErrors);
    
    if (newErrors.serviceType || newErrors.propertyAddress || newErrors.scheduledDate) {
      return;
    }
    
    confettiRef.current?.fire({ particleCount: 150, spread: 90, origin: { y: 0.6 } });

    // Attempt to create a public job draft on the backend so guests can continue after signup
    try {
      const resp = await createJobDraft({
        property_address: formData.propertyAddress,
        date: formData.scheduledDate,
        time: '10:00',
        service_type: formData.serviceType,
        service_level: formData.slaType,
        property_photos: formData.photos,
      });

      if (resp.success) {
        // store draft so signup flow can link to it
        sessionStorage.setItem('pendingBooking', JSON.stringify({ ...formData, jobDraft: resp.data }));
      } else {
        // still save client-side form so user can continue and show minimal feedback
        sessionStorage.setItem('pendingBooking', JSON.stringify(formData));
        console.warn('Failed to create job draft:', resp.error);
      }
    } catch (err) {
      console.error('Error creating job draft:', err);
      sessionStorage.setItem('pendingBooking', JSON.stringify(formData));
    }

    setTimeout(() => {
      navigate('/signup?booking=true');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <Confetti ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" manualstart />
      
      {/* Floating Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
        />
      </div>
      
      <nav className="bg-slate-900/80 backdrop-blur-xl shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Truck size={28} />
            </div>
            <span className="text-xl font-bold">UK Packers</span>
          </div>
          <button onClick={() => navigate('/login')} className="px-5 py-2 text-white hover:text-blue-400 transition">
            Already have an account? Sign In
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Quick Booking
          </motion.div>
          <h1 className="text-4xl font-black mb-4">Book Emergency Clearance</h1>
          <p className="text-gray-300">Fill in the details below. You'll create an account in the next step.</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="flex items-center">
            <motion.div 
              animate={{ scale: 1.1 }}
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
            >
              1
            </motion.div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
          <div>
            <label className="block text-sm font-semibold mb-2 text-white">Service Type</label>
            <select
              required
              value={formData.serviceType}
              onChange={(e) => {
                setFormData({ ...formData, serviceType: e.target.value });
                if (errors.serviceType) setErrors({ ...errors, serviceType: '' });
              }}
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border focus:outline-none text-white ${
                errors.serviceType ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
              }`}
            >
              <option value="" className="bg-slate-800 text-white">Select service</option>
              <option value="house-clearance" className="bg-slate-800 text-white">House Clearance</option>
              <option value="office-move" className="bg-slate-800 text-white">Office Move</option>
              <option value="emergency-clearance" className="bg-slate-800 text-white">Emergency Clearance</option>
              <option value="property-turnover" className="bg-slate-800 text-white">Property Turnover</option>
            </select>
            {errors.serviceType && <p className="text-red-400 text-sm mt-1">{errors.serviceType}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-white">
              <MapPin size={16} /> Property Address
            </label>
            <AddressInput
              value={formData.propertyAddress}
              onChange={(address) => {
                setFormData({ ...formData, propertyAddress: address });
                if (errors.propertyAddress) setErrors({ ...errors, propertyAddress: '' });
              }}
              placeholder="📍 Enter property address or find your location"
              required
              error={errors.propertyAddress}
            />
            {errors.propertyAddress && <p className="text-red-400 text-sm mt-1">{errors.propertyAddress}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-white">
              <Calendar size={16} /> Scheduled Date
            </label>
            <input
              required
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus:border-blue-500 focus:outline-none text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-white">
              <Package size={16} /> SLA Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['24h', '48h'].map((sla) => (
                <button
                  key={sla}
                  type="button"
                  onClick={() => setFormData({ ...formData, slaType: sla })}
                  className={`px-6 py-4 rounded-xl border-2 transition-all ${
                    formData.slaType === sla
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-white/20 bg-white/5 hover:border-white/40 text-white'
                  }`}
                >
                  <div className="font-bold text-lg">{sla}</div>
                  <div className="text-sm text-gray-300">{sla === '24h' ? 'Emergency' : 'Standard'}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-white">
              <Camera size={16} /> Property Photos (Optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, photos: Array.from(e.target.files || []) })}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus:border-blue-500 focus:outline-none text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
            />
            <p className="text-xs text-gray-400 mt-2">Upload photos of the property (optional)</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Continue to Sign Up
          </motion.button>
          </motion.div>
        </form>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Almost There!</h3>
                <p className="text-gray-300">Sign in or create an account to continue your booking</p>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sessionStorage.setItem('pendingBooking', JSON.stringify(formData));
                    navigate('/login?booking=true');
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all font-semibold text-white flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight size={20} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sessionStorage.setItem('pendingBooking', JSON.stringify(formData));
                    navigate('/signup?booking=true');
                  }}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur border-2 border-white/20 rounded-xl hover:bg-white/20 transition-all font-semibold text-white flex items-center justify-center gap-2"
                >
                  Create Account
                  <ArrowRight size={20} />
                </motion.button>
              </div>

              <p className="text-center text-sm text-gray-400 mt-6">
                Your booking details are saved and will be ready after you sign in
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
