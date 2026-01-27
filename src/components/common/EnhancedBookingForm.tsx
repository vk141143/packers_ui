import React, { useState, useCallback } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, User, Home, Package, AlertCircle, Camera, Plus, X } from 'lucide-react';
import { FlexiblePhotoUpload } from './FlexiblePhotoUpload';

interface PropertyDetails {
  type: 'house' | 'apartment' | 'office' | 'storage' | 'other';
  size: 'studio' | '1-bed' | '2-bed' | '3-bed' | '4-bed' | '5+bed' | 'small-office' | 'large-office';
  floors: number;
  hasElevator: boolean;
  parkingAccess: 'direct' | 'short-walk' | 'long-walk' | 'no-parking';
  accessRestrictions: string;
}

interface ServiceRequirements {
  serviceType: 'house-clearance' | 'office-move' | 'packing-service' | 'storage' | 'emergency-clearance';
  itemCategories: string[];
  estimatedVolume: 'small-van' | 'large-van' | 'small-truck' | 'large-truck' | 'multiple-trips';
  heavyItems: boolean;
  fragileItems: boolean;
  hazardousItems: boolean;
  packingRequired: boolean;
  storageRequired: boolean;
  urgency: 'standard' | 'urgent' | 'emergency';
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  preferredContact: 'phone' | 'email' | 'sms';
}

interface BookingDetails {
  preferredDate: string;
  preferredTime: string;
  flexibleDates: boolean;
  alternativeDates: string[];
  timeConstraints: string;
}

interface EnhancedBookingData {
  contactInfo: ContactInfo;
  propertyDetails: PropertyDetails;
  serviceRequirements: ServiceRequirements;
  bookingDetails: BookingDetails;
  pickupAddress: string;
  deliveryAddress?: string;
  specialInstructions: string;
  photos: File[];
  budget: string;
}

const ITEM_CATEGORIES = [
  'Furniture', 'Electronics', 'Clothing', 'Books/Documents', 'Kitchen Items',
  'Appliances', 'Garden Items', 'Artwork', 'Antiques', 'Sports Equipment'
];

export const EnhancedBookingForm: React.FC<{ onSubmit: (data: EnhancedBookingData) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<EnhancedBookingData>({
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      preferredContact: 'phone'
    },
    propertyDetails: {
      type: 'house',
      size: '2-bed',
      floors: 1,
      hasElevator: false,
      parkingAccess: 'direct',
      accessRestrictions: ''
    },
    serviceRequirements: {
      serviceType: 'house-clearance',
      itemCategories: [],
      estimatedVolume: 'large-van',
      heavyItems: false,
      fragileItems: false,
      hazardousItems: false,
      packingRequired: false,
      storageRequired: false,
      urgency: 'standard'
    },
    bookingDetails: {
      preferredDate: '',
      preferredTime: '',
      flexibleDates: false,
      alternativeDates: [],
      timeConstraints: ''
    },
    pickupAddress: '',
    deliveryAddress: '',
    specialInstructions: '',
    photos: [],
    budget: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = useCallback((section: keyof EnhancedBookingData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  }, []);

  const handleItemCategoryToggle = (category: string) => {
    const current = formData.serviceRequirements.itemCategories;
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    
    updateFormData('serviceRequirements', { itemCategories: updated });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 10)
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.contactInfo.name) newErrors.name = 'Name is required';
        if (!formData.contactInfo.email) newErrors.email = 'Email is required';
        if (!formData.contactInfo.phone) newErrors.phone = 'Phone is required';
        break;
      case 2:
        if (!formData.pickupAddress) newErrors.pickupAddress = 'Pickup address is required';
        break;
      case 3:
        if (formData.serviceRequirements.itemCategories.length === 0) {
          newErrors.itemCategories = 'Select at least one item category';
        }
        break;
      case 4:
        if (!formData.bookingDetails.preferredDate) newErrors.preferredDate = 'Preferred date is required';
        if (!formData.bookingDetails.preferredTime) newErrors.preferredTime = 'Preferred time is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSubmit(formData);
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.contactInfo.name}
                  onChange={(e) => updateFormData('contactInfo', { name: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => updateFormData('contactInfo', { email: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.contactInfo.phone}
                  onChange={(e) => updateFormData('contactInfo', { phone: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alternate Phone</label>
                <input
                  type="tel"
                  value={formData.contactInfo.alternatePhone || ''}
                  onChange={(e) => updateFormData('contactInfo', { alternatePhone: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Alternate contact number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preferred Contact Method</label>
              <div className="flex gap-4">
                {['phone', 'email', 'sms'].map(method => (
                  <label key={method} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method}
                      checked={formData.contactInfo.preferredContact === method}
                      onChange={(e) => updateFormData('contactInfo', { preferredContact: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{method}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Home className="w-5 h-5" />
              Property Details
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2">Pickup Address *</label>
              <textarea
                value={formData.pickupAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, pickupAddress: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter complete pickup address including postcode"
              />
              {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Delivery Address (if different)</label>
              <textarea
                value={formData.deliveryAddress || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter delivery address if items need to be moved elsewhere"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <select
                  value={formData.propertyDetails.type}
                  onChange={(e) => updateFormData('propertyDetails', { type: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="office">Office</option>
                  <option value="storage">Storage Unit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Size</label>
                <select
                  value={formData.propertyDetails.size}
                  onChange={(e) => updateFormData('propertyDetails', { size: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="studio">Studio</option>
                  <option value="1-bed">1 Bedroom</option>
                  <option value="2-bed">2 Bedroom</option>
                  <option value="3-bed">3 Bedroom</option>
                  <option value="4-bed">4 Bedroom</option>
                  <option value="5+bed">5+ Bedroom</option>
                  <option value="small-office">Small Office</option>
                  <option value="large-office">Large Office</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number of Floors</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.propertyDetails.floors}
                  onChange={(e) => updateFormData('propertyDetails', { floors: parseInt(e.target.value) })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Parking Access</label>
                <select
                  value={formData.propertyDetails.parkingAccess}
                  onChange={(e) => updateFormData('propertyDetails', { parkingAccess: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="direct">Direct Access</option>
                  <option value="short-walk">Short Walk (under 50m)</option>
                  <option value="long-walk">Long Walk (over 50m)</option>
                  <option value="no-parking">No Parking Available</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasElevator"
                checked={formData.propertyDetails.hasElevator}
                onChange={(e) => updateFormData('propertyDetails', { hasElevator: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="hasElevator" className="text-sm font-medium">
                Building has elevator access
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Access Restrictions</label>
              <textarea
                value={formData.propertyDetails.accessRestrictions}
                onChange={(e) => updateFormData('propertyDetails', { accessRestrictions: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Any access restrictions, narrow doorways, stairs, etc."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Service Requirements
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2">Service Type</label>
              <select
                value={formData.serviceRequirements.serviceType}
                onChange={(e) => updateFormData('serviceRequirements', { serviceType: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="house-clearance">House Clearance</option>
                <option value="office-move">Office Move</option>
                <option value="packing-service">Packing Service</option>
                <option value="storage">Storage Service</option>
                <option value="emergency-clearance">Emergency Clearance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Item Categories *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ITEM_CATEGORIES.map(category => (
                  <label key={category} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.serviceRequirements.itemCategories.includes(category)}
                      onChange={() => handleItemCategoryToggle(category)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
              {errors.itemCategories && <p className="text-red-500 text-sm mt-1">{errors.itemCategories}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estimated Volume</label>
              <select
                value={formData.serviceRequirements.estimatedVolume}
                onChange={(e) => updateFormData('serviceRequirements', { estimatedVolume: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="small-van">Small Van (up to 10 cubic meters)</option>
                <option value="large-van">Large Van (10-20 cubic meters)</option>
                <option value="small-truck">Small Truck (20-40 cubic meters)</option>
                <option value="large-truck">Large Truck (40+ cubic meters)</option>
                <option value="multiple-trips">Multiple Trips Required</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Special Item Types</h4>
                {[
                  { key: 'heavyItems', label: 'Heavy Items (furniture, appliances)' },
                  { key: 'fragileItems', label: 'Fragile Items (glass, artwork)' },
                  { key: 'hazardousItems', label: 'Hazardous Items (chemicals, batteries)' }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.serviceRequirements[item.key as keyof ServiceRequirements] as boolean}
                      onChange={(e) => updateFormData('serviceRequirements', { [item.key]: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Additional Services</h4>
                {[
                  { key: 'packingRequired', label: 'Packing Service Required' },
                  { key: 'storageRequired', label: 'Storage Service Required' }
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.serviceRequirements[item.key as keyof ServiceRequirements] as boolean}
                      onChange={(e) => updateFormData('serviceRequirements', { [item.key]: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Urgency Level</label>
              <div className="flex gap-4">
                {[
                  { value: 'standard', label: 'Standard (7+ days)', color: 'text-green-600' },
                  { value: 'urgent', label: 'Urgent (2-7 days)', color: 'text-orange-600' },
                  { value: 'emergency', label: 'Emergency (within 48h)', color: 'text-red-600' }
                ].map(option => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="urgency"
                      value={option.value}
                      checked={formData.serviceRequirements.urgency === option.value}
                      onChange={(e) => updateFormData('serviceRequirements', { urgency: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className={`text-sm ${option.color}`}>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Booking Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Date *</label>
                <input
                  type="date"
                  value={formData.bookingDetails.preferredDate}
                  onChange={(e) => updateFormData('bookingDetails', { preferredDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.preferredDate && <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Time *</label>
                <select
                  value={formData.bookingDetails.preferredTime}
                  onChange={(e) => updateFormData('bookingDetails', { preferredTime: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select time</option>
                  <option value="morning">Morning (8AM - 12PM)</option>
                  <option value="afternoon">Afternoon (12PM - 5PM)</option>
                  <option value="evening">Evening (5PM - 8PM)</option>
                  <option value="flexible">Flexible</option>
                </select>
                {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="flexibleDates"
                checked={formData.bookingDetails.flexibleDates}
                onChange={(e) => updateFormData('bookingDetails', { flexibleDates: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="flexibleDates" className="text-sm font-medium">
                I'm flexible with dates (may result in better pricing)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Time Constraints</label>
              <textarea
                value={formData.bookingDetails.timeConstraints}
                onChange={(e) => updateFormData('bookingDetails', { timeConstraints: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Any specific time constraints or requirements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Budget Range (Optional)</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select budget range</option>
                <option value="under-200">Under £200</option>
                <option value="200-500">£200 - £500</option>
                <option value="500-1000">£500 - £1,000</option>
                <option value="1000-2000">£1,000 - £2,000</option>
                <option value="over-2000">Over £2,000</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Additional Information
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2">Photos (Optional)</label>
              <p className="text-sm text-gray-600 mb-3">📸 Upload photos for more accurate AI analysis and faster quote processing</p>
              
              <div className="space-y-4">
                <FlexiblePhotoUpload
                  onPhotoCapture={(photoDataUrl) => {
                    // Convert data URL to File object
                    fetch(photoDataUrl)
                      .then(res => res.blob())
                      .then(blob => {
                        const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
                        setFormData(prev => ({
                          ...prev,
                          photos: [...prev.photos, file].slice(0, 10)
                        }));
                      });
                  }}
                  userRole="client"
                  type="before"
                />
                
                <div className="text-center text-gray-500 text-sm">or</div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload photos from device</p>
                  </label>
                </div>
              </div>
              
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Special Instructions</label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Any special instructions, concerns, or additional information..."
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• We'll review your requirements and generate a detailed quote</li>
                <li>• You'll receive the quote within 2-4 hours</li>
                <li>• Once approved, we'll schedule your service</li>
                <li>• Our professional team will handle everything</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Request Detailed Quote</h2>
          <span className="text-sm text-gray-500">Step {currentStep} of 5</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {renderStep()}

      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1 || isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              'Submit Quote Request'
            )}
          </button>
        )}
      </div>
    </div>
  );
};