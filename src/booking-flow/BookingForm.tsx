import React, { useState, useCallback } from 'react';
import { BookingFormData } from './types';
import { bookingFlowStore } from './store';
import { useStatusPopup } from '../src/components/common/StatusPopupManager';

interface BookingFormProps {
  onSuccess: (bookingId: string) => void;
}

const VALIDATION_RULES = {
  customerName: (value: string) => !value.trim() ? 'Name is required' : '',
  customerEmail: (value: string) => {
    if (!value.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
    return '';
  },
  customerPhone: (value: string) => {
    if (!value.trim()) return 'Phone is required';
    if (!/^[\d\s\+\-\(\)]+$/.test(value.replace(/\s/g, ''))) return 'Invalid phone format';
    return '';
  },
  serviceType: (value: string) => !value ? 'Service type is required' : '',
  propertyAddress: (value: string) => !value.trim() ? 'Address is required' : '',
  scheduledDate: (value: string) => !value ? 'Date is required' : '',
  scheduledTime: (value: string) => !value ? 'Time is required' : '',
  propertySize: (value: string) => !value ? 'Property size is required' : '',
  vanLoads: (value: string) => !value ? 'Van loads is required' : ''
};

export const BookingForm: React.FC<BookingFormProps> = React.memo(({ onSuccess }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceType: '',
    propertyAddress: '',
    scheduledDate: '',
    scheduledTime: '',
    propertySize: '',
    vanLoads: '',
    wasteTypes: [],
    accessDifficulty: [],
    complianceAddons: [],
    specialRequirements: ''
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showStatus, StatusPopup } = useStatusPopup();

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<BookingFormData> = {};
    
    Object.entries(VALIDATION_RULES).forEach(([field, validator]) => {
      const error = validator(formData[field as keyof BookingFormData]);
      if (error) newErrors[field as keyof BookingFormData] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const estimatedPrice = bookingFlowStore.calculatePrice(formData.serviceType);
      
      const booking = bookingFlowStore.createBooking({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        serviceType: formData.serviceType as 'house-clearance' | 'office-move' | 'emergency-clearance',
        propertyAddress: formData.propertyAddress,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        specialRequirements: formData.specialRequirements,
        estimatedPrice
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      showStatus('booking-submitted');
      setTimeout(() => onSuccess(booking.id), 3000);
    } catch (error) {
      console.error('Booking failed:', error);
      setErrors({ customerName: 'Booking failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSuccess]);

  const handleInputChange = useCallback((field: keyof BookingFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleCheckboxChange = useCallback((field: 'wasteTypes' | 'accessDifficulty' | 'complianceAddons', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Service</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customerEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.customerPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
            {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Type *
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => handleInputChange('serviceType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.serviceType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a service</option>
              <option value="house-clearance">House Clearance - £300</option>
              <option value="office-move">Office Move - £500</option>
              <option value="emergency-clearance">Emergency Clearance - £400</option>
            </select>
            {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Address *
          </label>
          <input
            type="text"
            value={formData.propertyAddress}
            onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.propertyAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter the property address"
          />
          {errors.propertyAddress && <p className="text-red-500 text-sm mt-1">{errors.propertyAddress}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Date *
            </label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.scheduledDate && <p className="text-red-500 text-sm mt-1">{errors.scheduledDate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Time *
            </label>
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.scheduledTime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.scheduledTime && <p className="text-red-500 text-sm mt-1">{errors.scheduledTime}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🏠 Property Size *
            </label>
            <select
              value={formData.propertySize}
              onChange={(e) => handleInputChange('propertySize', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.propertySize ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select property size</option>
              <option value="studio">Studio</option>
              <option value="1-bed">1-bed flat</option>
              <option value="2-bed">2-bed flat</option>
              <option value="3-bed">3-bed house</option>
              <option value="4-bed">4-bed house</option>
              <option value="5-bed-plus">5+ bed house</option>
            </select>
            {errors.propertySize && <p className="text-red-500 text-sm mt-1">{errors.propertySize}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🚚 Van Loads *
            </label>
            <select
              value={formData.vanLoads}
              onChange={(e) => handleInputChange('vanLoads', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.vanLoads ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select van loads</option>
              <option value="1">1 van load</option>
              <option value="2">2 van loads</option>
              <option value="3">3 van loads</option>
              <option value="4">4 van loads</option>
              <option value="5-plus">5+ van loads</option>
            </select>
            {errors.vanLoads && <p className="text-red-500 text-sm mt-1">{errors.vanLoads}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🗑️ Waste Types
          </label>
          <div className="space-y-2">
            {['General waste', 'Furniture/appliances', 'Garden waste', 'Construction waste', 'Hazardous waste'].map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.wasteTypes.includes(type)}
                  onChange={() => handleCheckboxChange('wasteTypes', type)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🚪 Access Difficulty
          </label>
          <div className="space-y-2">
            {['Ground floor', 'Stairs (no lift)', 'Restricted parking', 'Long carry distance'].map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.accessDifficulty.includes(type)}
                  onChange={() => handleCheckboxChange('accessDifficulty', type)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📋 Compliance Add-ons
          </label>
          <div className="space-y-2">
            {['Photo report', 'Council compliance pack', 'Deep sanitation/bio clean'].map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.complianceAddons.includes(type)}
                  onChange={() => handleCheckboxChange('complianceAddons', type)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>



        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requirements (Optional)
          </label>
          <textarea
            value={formData.specialRequirements}
            onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any special requirements or notes..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Book Service'}
        </button>
      </form>
      
      <StatusPopup />
    </div>
  );
});