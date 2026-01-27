import React from 'react';
import { MapPin, Calendar, Package } from 'lucide-react';
import { AddressInput } from '../../src/components/common/AddressInput';

interface BookingFormProps {
  formData: {
    serviceType: string;
    propertyAddress: string;
    scheduledDate: string;
    slaType: string;
    photos: File[];
  };
  errors: {
    serviceType: string;
    propertyAddress: string;
    scheduledDate: string;
  };
  onFormChange: (field: string, value: any) => void;
  onErrorClear: (field: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  formData,
  errors,
  onFormChange,
  onErrorClear,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2 text-white">Service Type</label>
        <select
          required
          value={formData.serviceType}
          onChange={(e) => {
            onFormChange('serviceType', e.target.value);
            if (errors.serviceType) onErrorClear('serviceType');
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
            onFormChange('propertyAddress', address);
            if (errors.propertyAddress) onErrorClear('propertyAddress');
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
          onChange={(e) => onFormChange('scheduledDate', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus:border-blue-500 focus:outline-none text-white"
        />
        {errors.scheduledDate && <p className="text-red-400 text-sm mt-1">{errors.scheduledDate}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-white">
          <Package size={16} /> Service Level
        </label>
        <select
          value={formData.slaType}
          onChange={(e) => onFormChange('slaType', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus:border-blue-500 focus:outline-none text-white"
        >
          <option value="24h" className="bg-slate-800 text-white">Emergency (24h) - £50 extra</option>
          <option value="48h" className="bg-slate-800 text-white">Standard (48h)</option>
          <option value="72h" className="bg-slate-800 text-white">Economy (72h) - 10% discount</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
      >
        Continue to Sign Up
      </button>
    </form>
  );
};