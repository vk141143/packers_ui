import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Package, ArrowRight, Truck, Camera, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Confetti, type ConfettiRef } from '../../src/components/common/Confetti';
import { AddressInput } from '../../src/components/common/AddressInput';
import { createJobDraft } from '../../src/services/api';

export const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const confettiRef = useRef<ConfettiRef>(null);
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
    
    const newErrors = {
      serviceType: !formData.serviceType ? 'Please select a service type' : '',
      propertyAddress: !formData.propertyAddress.trim() ? 'Property address is required' : '',
      scheduledDate: !formData.scheduledDate ? 'Please select a date' : '',
    };

    if (formData.scheduledDate && new Date(formData.scheduledDate) < new Date()) {
      newErrors.scheduledDate = 'Date cannot be in the past';
    }

    setErrors(newErrors);
    
    if (newErrors.serviceType || newErrors.propertyAddress || newErrors.scheduledDate) {
      return;
    }
    
    confettiRef.current?.fire({ particleCount: 150, spread: 90, origin: { y: 0.6 } });

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
        sessionStorage.setItem('pendingBooking', JSON.stringify({ ...formData, jobDraft: resp.data }));
      } else {
        sessionStorage.setItem('pendingBooking', JSON.stringify(formData));
      }
    } catch (err) {
      sessionStorage.setItem('pendingBooking', JSON.stringify(formData));
    }

    setTimeout(() => {
      navigate('/signup?booking=true');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <Confetti ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" manualstart />
      
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

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-6">
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
            {errors.scheduledDate && <p className="text-red-400 text-sm mt-1">{errors.scheduledDate}</p>}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            Continue to Sign Up
            <ArrowRight size={20} />
          </motion.button>
        </form>
      </div>
    </div>
  );
};