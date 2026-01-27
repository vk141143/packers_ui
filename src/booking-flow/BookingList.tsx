import React, { useState, useEffect } from 'react';
import { BookingRequest } from './types';
import { bookingFlowStore } from './store';
import { CancellationModal } from './CancellationModal';
import { Calendar, MapPin, Phone, Mail, Package, Clock, XCircle, RefreshCw } from 'lucide-react';

export const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [showCancelModal, setShowCancelModal] = useState<BookingRequest | null>(null);
  const [isProcessingCancel, setIsProcessingCancel] = useState(false);

  useEffect(() => {
    const updateBookings = () => setBookings(bookingFlowStore.getBookings());
    updateBookings();
    
    const unsubscribe = bookingFlowStore.subscribe(updateBookings);
    return unsubscribe;
  }, []);

  const getStatusColor = (status: BookingRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelBooking = async (reason: string) => {
    if (!showCancelModal) return;
    
    setIsProcessingCancel(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = bookingFlowStore.cancelBooking(showCancelModal.id, reason, 'Client');
      if (success) {
        // Process refund
        bookingFlowStore.processRefund(showCancelModal.id, showCancelModal.estimatedPrice);
        alert('Booking cancelled successfully! Refund will be processed within 5-7 business days.');
      } else {
        alert('Unable to cancel booking at this time.');
      }
    } catch (error) {
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setIsProcessingCancel(false);
      setShowCancelModal(null);
    }
  };

  const updateStatus = (id: string, status: BookingRequest['status']) => {
    bookingFlowStore.updateBookingStatus(id, status);
  };

  if (bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600">Create your first booking to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Bookings</h2>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{booking.id}</h3>
                <p className="text-sm text-gray-600">
                  Created: {new Date(booking.createdAt).toLocaleDateString()}
                </p>
                {booking.status === 'cancelled' && (
                  <div className="mt-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Cancelled: {booking.cancellationReason}</span>
                  </div>
                )}
                {booking.status === 'refunded' && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600">Refunded: £{booking.refundAmount}</span>
                    </div>
                    <p className="text-xs text-gray-500">Processed on {booking.refundedAt && new Date(booking.refundedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
                {!booking.depositPaid && booking.status !== 'completed' && booking.status !== 'cancelled' && booking.status !== 'refunded' && (
                  <button
                    onClick={() => setShowCancelModal(booking)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3 h-3" />
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Service</p>
                  <p className="text-sm font-medium capitalize">
                    {booking.serviceType.replace('-', ' ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Address</p>
                  <p className="text-sm font-medium truncate">{booking.propertyAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-xs text-gray-600">Date & Time</p>
                  <p className="text-sm font-medium">
                    {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-purple-600 font-bold text-sm">£</span>
                <div>
                  <p className="text-xs text-gray-600">Price</p>
                  <p className="text-sm font-medium">£{booking.estimatedPrice}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Customer</p>
                  <p className="text-sm font-medium">{booking.customerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <p className="text-sm font-medium">{booking.customerPhone}</p>
                </div>
              </div>
            </div>

            {booking.specialRequirements && (
              <div className="bg-gray-50 rounded p-3 mt-4">
                <p className="text-xs text-gray-600 mb-1">Special Requirements:</p>
                <p className="text-sm text-gray-800">{booking.specialRequirements}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Cancellation Modal */}
      {showCancelModal && (
        <CancellationModal
          booking={showCancelModal}
          onCancel={handleCancelBooking}
          onClose={() => setShowCancelModal(null)}
          isProcessing={isProcessingCancel}
        />
      )}
    </div>
  );
};