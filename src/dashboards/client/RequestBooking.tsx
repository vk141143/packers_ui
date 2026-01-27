import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Package, Send, ArrowLeft, X, Clock, Home, Trash2, AlertTriangle, FileText, Zap, Timer, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { jobStore } from '../../store/jobStore';
import { EnhancedPhotoUploadModal } from '../../components/common/EnhancedPhotoUploadModal';
import { CapturedPhoto } from '../../types/camera';

export const RequestBooking: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    propertyAddress: '',
    serviceType: 'emergency-clearance',
    preferredDate: '',
    preferredTime: '',
    urgency: 'standard',
    propertySize: '',
    vanLoads: '',
    wasteTypes: [] as string[],
    furnitureCount: '',
    accessDifficulty: [] as string[],
    complianceAddons: [] as string[],
    description: '',
    photos: [] as CapturedPhoto[]
  });
  
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Date is required';
    } else if (new Date(formData.preferredDate) < new Date().setHours(0,0,0,0)) {
      newErrors.preferredDate = 'Date cannot be in the past';
    }
    
    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Combine date + time into ISO datetime string
    const scheduledDate = `${formData.preferredDate}T${formData.preferredTime}:00.000Z`;
    
    // Create new job (Step 1: Client booking request)
    const newJob = jobStore.createJob({
      clientName: 'Client',
      clientId: '1',
      clientType: 'council',
      propertyAddress: formData.propertyAddress,
      serviceType: formData.serviceType as any,
      scheduledDate,
      urgency: formData.urgency as any,
      description: formData.description,
      propertySize: formData.propertySize,
      vanLoads: formData.vanLoads,
      wasteTypes: formData.wasteTypes,
      accessDifficulty: formData.accessDifficulty,
      complianceAddons: formData.complianceAddons,
      photos: formData.photos.map(photo => ({
        id: photo.id,
        url: photo.previewUrl,
        type: 'before' as const,
        uploadedAt: photo.capturedAt,
        uploadedBy: 'Client'
      }))
    });

    alert('✅ Booking request submitted! Our operations team will review and provide a quote within 24 hours.');
    navigate('/client');
  };

  const handlePhotosAdded = (newPhotos: CapturedPhoto[]) => {
    const totalPhotos = formData.photos.length + newPhotos.length;
    if (totalPhotos > 10) {
      alert('Maximum 10 photos allowed');
      return;
    }
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Show pending booking notification */}
          {pendingBookingData && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <Package className="w-3 h-3 text-white" />
                </div>
                <p className="font-semibold text-green-800">Booking Data Loaded</p>
              </div>
              <p className="text-sm text-green-700">
                Your booking details from the previous session have been loaded. 
                {pendingBookingData.jobId && (
                  <span className="font-medium"> Job ID: {pendingBookingData.jobId}</span>
                )}
              </p>
            </motion.div>
          )}
          {/* Header with gradient background */}
          <div className="mb-8 -m-8 p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-t-2xl">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => navigate('/client')} 
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors bg-white px-3 py-2 rounded-lg shadow-sm"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Request New Booking</h1>
              <p className="text-lg text-gray-600 mb-2">Step 1: Submit your property clearance requirements</p>
              <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                <Clock className="w-4 h-4" />
                <span>Takes 3-5 minutes • Get quote within 24 hours</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Address with enhanced styling */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100"
            >
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                Property Address *
              </label>
              <input
                type="text"
                required
                value={formData.propertyAddress}
                onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all"
                placeholder="e.g., 123 High Street, London, SW1A 1AA"
              />
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                <Building className="w-4 h-4" />
                Include postcode for accurate service area verification
              </p>
            </motion.div>

            {/* Service Type with visual cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                Service Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'emergency-clearance', label: 'Emergency Clearance', icon: '🚨', desc: 'Urgent same-day service' },
                  { value: 'house-clearance', label: 'House Clearance', icon: '🏠', desc: 'Full property clearance' },
                  { value: 'office-clearance', label: 'Office Clearance', icon: '🏢', desc: 'Commercial spaces' },
                  { value: 'garden-clearance', label: 'Garden Clearance', icon: '🌿', desc: 'Outdoor waste removal' }
                ].map((service) => (
                  <motion.label
                    key={service.value}
                    whileHover={{ scale: 1.02 }}
                    className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      formData.serviceType === service.value
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      value={service.value}
                      checked={formData.serviceType === service.value}
                      onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-2">{service.icon}</div>
                      <div className="font-semibold text-gray-900 mb-1">{service.label}</div>
                      <div className="text-xs text-gray-900">{service.desc}</div>
                    </div>
                    {formData.serviceType === service.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Date & Time with enhanced styling */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Schedule Your Service</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                      errors.preferredDate ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.preferredDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.preferredDate}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⏰ Preferred Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                      errors.preferredTime ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.preferredTime && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {errors.preferredTime}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Timer className="w-4 h-4 text-green-600" />
                  <span>Our team operates 7am-7pm, 7 days a week</span>
                </p>
              </div>
            </motion.div>

            {/* Urgency Level with visual indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'standard', label: 'Standard', icon: '📅', time: '48-72 hours', color: 'green' },
                  { value: 'urgent', label: 'Urgent', icon: '⚡', time: '24-48 hours', color: 'orange' },
                  { value: 'emergency', label: 'Emergency', icon: '🚨', time: 'Same day', color: 'red' }
                ].map((urgency) => (
                  <motion.label
                    key={urgency.value}
                    whileHover={{ scale: 1.02 }}
                    className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      formData.urgency === urgency.value
                        ? `border-${urgency.color}-500 bg-${urgency.color}-50 shadow-md`
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={urgency.value}
                      checked={formData.urgency === urgency.value}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-2">{urgency.icon}</div>
                      <div className="font-semibold text-gray-900 mb-1">{urgency.label}</div>
                      <div className="text-xs text-gray-900">{urgency.time}</div>
                    </div>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Property Details with enhanced styling */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Property Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">🏠 Property Size *</label>
                  <div className="space-y-2">
                    {[
                      { value: 'studio', label: 'Studio', desc: '1 room' },
                      { value: '1-bed', label: '1-bed flat', desc: 'Small flat' },
                      { value: '2-bed', label: '2-bed flat', desc: 'Medium flat' },
                      { value: '3-bed', label: '3-bed house', desc: 'Family home' },
                      { value: '4-bed', label: '4-bed house', desc: 'Large home' },
                      { value: '5-bed-plus', label: '5+ bed house', desc: 'Very large' }
                    ].map((size) => (
                      <label key={size.value} className="flex items-center p-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="propertySize"
                          value={size.value}
                          checked={formData.propertySize === size.value}
                          onChange={(e) => setFormData({...formData, propertySize: e.target.value})}
                          className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{size.label}</div>
                          <div className="text-xs text-gray-900">{size.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">🚚 Van Loads *</label>
                  <div className="space-y-2">
                    {[
                      { value: '1', label: '1 van load', desc: 'Small job' },
                      { value: '2', label: '2 van loads', desc: 'Medium job' },
                      { value: '3', label: '3 van loads', desc: 'Large job' },
                      { value: '4', label: '4 van loads', desc: 'Very large' },
                      { value: '5-plus', label: '5+ van loads', desc: 'Multiple trips' }
                    ].map((load) => (
                      <label key={load.value} className="flex items-center p-2 rounded-lg hover:bg-white transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="vanLoads"
                          value={load.value}
                          checked={formData.vanLoads === load.value}
                          onChange={(e) => setFormData({...formData, vanLoads: e.target.value})}
                          className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{load.label}</div>
                          <div className="text-xs text-gray-900">{load.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Waste Types with visual icons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-white" />
                </div>
                Waste Types
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { type: 'General waste', icon: '🗑️', desc: 'Household items' },
                  { type: 'Furniture/appliances', icon: '🛋️', desc: 'Large items' },
                  { type: 'Garden waste', icon: '🌿', desc: 'Green waste' },
                  { type: 'Construction waste', icon: '🧱', desc: 'Building materials' },
                  { type: 'Hazardous waste', icon: '⚠️', desc: 'Special handling' },
                  { type: 'Electronic waste', icon: '📱', desc: 'WEEE items' }
                ].map(waste => (
                  <motion.label 
                    key={waste.type} 
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.wasteTypes.includes(waste.type)
                        ? 'border-red-500 bg-red-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-red-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.wasteTypes.includes(waste.type)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.wasteTypes, waste.type]
                          : formData.wasteTypes.filter(t => t !== waste.type);
                        setFormData({...formData, wasteTypes: updated});
                      }}
                      className="sr-only"
                    />
                    <div className="text-2xl mr-3">{waste.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{waste.type}</div>
                      <div className="text-xs text-gray-900">{waste.desc}</div>
                    </div>
                    {formData.wasteTypes.includes(waste.type) && (
                      <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </motion.label>
                ))}
              </div>
              
              {/* Furniture Count Input */}
              {formData.wasteTypes.includes('Furniture/appliances') && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-white rounded-lg border border-red-200"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🛋️ How many furniture/appliance items?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.furnitureCount}
                    onChange={(e) => setFormData({...formData, furnitureCount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="e.g., 5"
                  />
                  <p className="text-xs text-gray-600 mt-1">Count individual items (sofa = 1, dining set = 5, etc.)</p>
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Photos Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100"
            >
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                Photos (Optional)
              </label>
              <div className="bg-white p-4 rounded-lg border border-yellow-200 mb-4">
                <p className="text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">📸</span>
                  <span><strong>Pro tip:</strong> Upload photos for more accurate AI analysis and faster quote processing</span>
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Better accuracy
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Faster quotes
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Fewer site visits
                  </span>
                </div>
              </div>
              
              <motion.button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 border-2 border-dashed border-yellow-300 rounded-xl py-8 px-4 hover:border-yellow-500 hover:bg-yellow-50 transition-all bg-white"
              >
                <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Add Photos</div>
                  <div className="text-sm text-gray-600">Tap to capture or upload images</div>
                </div>
              </motion.button>
              
              <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    formData.photos.length > 0 ? 'bg-green-500' : 'bg-gray-300'
                  }`}></span>
                  {formData.photos.length} / 10 photos uploaded
                </span>
                <span>Max 5MB per photo</span>
              </div>
              
              {/* Enhanced Photo Preview Grid */}
              {formData.photos.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4"
                >
                  {formData.photos.map((photo, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative group"
                    >
                      <img
                        src={photo.previewUrl}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Access Difficulty with visual indicators */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                Access Difficulty
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'Ground floor', icon: '🏠', desc: 'Easy access' },
                  { type: 'Stairs (no lift)', icon: '🪜', desc: 'Manual carrying' },
                  { type: 'Restricted parking', icon: '🚫', desc: 'Limited vehicle access' },
                  { type: 'Long carry distance', icon: '🚶', desc: 'Extended walking' }
                ].map(access => (
                  <motion.label 
                    key={access.type} 
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.accessDifficulty.includes(access.type)
                        ? 'border-amber-500 bg-amber-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.accessDifficulty.includes(access.type)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...formData.accessDifficulty, access.type]
                          : formData.accessDifficulty.filter(t => t !== access.type);
                        setFormData({...formData, accessDifficulty: updated});
                      }}
                      className="sr-only"
                    />
                    <div className="text-2xl mr-3">{access.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{access.type}</div>
                      <div className="text-xs text-gray-900">{access.desc}</div>
                    </div>
                    {formData.accessDifficulty.includes(access.type) && (
                      <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Additional Information with enhanced styling */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200"
            >
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Additional Information
              </label>
              <div className="bg-white rounded-lg border border-gray-200 p-1">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="💬 Tell us more about your requirements...

• Special access instructions
• Fragile or valuable items
• Time constraints
• Any concerns or questions"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                <span className="text-blue-600">💡</span>
                The more details you provide, the more accurate our quote will be
              </p>
            </motion.div>

            {/* Enhanced Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-6 px-8 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 hover:opacity-20 transition-opacity"></div>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <span>Submit Booking Request</span>
              <div className="text-sm opacity-80">→</div>
            </motion.button>
            
            {/* Progress indicator */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 mb-2">What happens next?</p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Submit request</span>
                </div>
                <span>→</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Get quote (24h)</span>
                </div>
                <span>→</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Book & pay</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
      
      {/* Enhanced Photo Upload Modal */}
      <EnhancedPhotoUploadModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onPhotosAdded={handlePhotosAdded}
        maxPhotos={10}
      />
    </div>
  );
};