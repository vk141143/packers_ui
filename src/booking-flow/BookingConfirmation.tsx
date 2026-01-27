import React from 'react';
import { BookingRequest } from './types';
import { CheckCircle, Calendar, MapPin, Phone, Mail, Package } from 'lucide-react';

interface BookingConfirmationProps {
  booking: BookingRequest;
  onNewBooking: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ 
  booking, 
  onNewBooking 
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">Your booking has been successfully created</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">ID</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Booking Reference</p>
              <p className="font-semibold text-gray-900">{booking.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Package className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Service Type</p>
              <p className="font-semibold text-gray-900 capitalize">
                {booking.serviceType.replace('-', ' ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Property Address</p>
              <p className="font-semibold text-gray-900">{booking.propertyAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scheduled Date & Time</p>
              <p className="font-semibold text-gray-900">
                {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-semibold text-sm">£</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Price (Not Final)</p>
              <p className="font-semibold text-gray-900">£{booking.estimatedPrice}</p>
              <p className="text-xs text-orange-600">Final price will be provided after job completion</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">N</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-gray-900">{booking.customerName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{booking.customerEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900">{booking.customerPhone}</p>
            </div>
          </div>
        </div>
      </div>

      {booking.specialRequirements && (
        <div className="bg-yellow-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Requirements</h3>
          <p className="text-gray-700">{booking.specialRequirements}</p>
        </div>
      )}

      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• You will receive a confirmation email shortly</li>
          <li>• Our team will contact you 24 hours before the scheduled date</li>
          <li>• Payment will be collected on completion of service</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onNewBooking}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        >
          Book Another Service
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
        >
          Print Confirmation
        </button>
      </div>
    </div>
  );
};