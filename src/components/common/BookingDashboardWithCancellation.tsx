import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, DollarSign, AlertCircle, CheckCircle, X, Eye } from 'lucide-react';
import { Job } from '../../types';
import { ClientBookingCancel } from './ClientBookingCancel';

interface BookingDashboardProps {
  bookings: Job[];
  onBookingUpdate?: (bookingId: string) => void;
}

export const BookingDashboardWithCancellation: React.FC<BookingDashboardProps> = ({
  bookings,
  onBookingUpdate
}) => {
  const [selectedBooking, setSelectedBooking] = useState<Job | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'client-booking-request':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'admin-quoted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'client-approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'work-completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canCancelBooking = (booking: Job) => {
    const cancelableStatuses = ['client-booking-request', 'admin-quoted', 'client-approved'];
    return cancelableStatuses.includes(booking.status);
  };

  const hasDepositPaid = (booking: Job) => {
    return (booking.finalQuote?.depositAmount || booking.initialPayment?.amount || 0) > 0;
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'active') return !['work-completed', 'cancelled'].includes(booking.status);
    if (filter === 'completed') return booking.status === 'work-completed';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const handleCancelBooking = (booking: Job) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelSuccess = () => {
    if (selectedBooking) {
      onBookingUpdate?.(selectedBooking.id);
    }
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your service bookings and track their progress</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: 'all', label: 'All Bookings' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Card Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {booking.serviceType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <p className="text-sm text-gray-600">#{booking.immutableReferenceId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                  {booking.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>

              {/* Booking Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(booking.scheduledDate).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>{booking.timeSlot || 'Time TBD'}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span className="truncate">{booking.location?.address || 'Address not provided'}</span>
                </div>

                {/* Payment Info */}
                {(booking.finalQuote?.depositAmount || booking.initialPayment?.amount) && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={16} className="text-green-600" />
                    <span className="text-green-600 font-semibold">
                      Deposit: £{(booking.finalQuote?.depositAmount || booking.initialPayment?.amount || 0).toFixed(2)}
                    </span>
                    {hasDepositPaid(booking) && (
                      <CheckCircle size={14} className="text-green-600" />
                    )}
                  </div>
                )}

                {booking.finalQuote?.totalAmount && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} />
                    <span>Total: £{booking.finalQuote.totalAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Actions */}
            <div className="px-6 pb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View Details
                </button>

                {canCancelBooking(booking) && (
                  <button
                    onClick={() => handleCancelBooking(booking)}
                    className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                )}
              </div>

              {/* Cancellation Notice */}
              {hasDepositPaid(booking) && canCancelBooking(booking) && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-yellow-800">
                    <AlertCircle size={12} />
                    <span>Deposit paid - cancellation fees may apply</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? "You don't have any bookings yet." 
              : `No ${filter} bookings found.`}
          </p>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && !showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <button
                onClick={() => setSelectedBooking(null)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <p className="text-blue-100 mt-1">#{selectedBooking.immutableReferenceId}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Service Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Service Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Service Type</p>
                    <p className="font-semibold capitalize">{selectedBooking.serviceType.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">Scheduled Date</p>
                    <p className="font-semibold">{new Date(selectedBooking.scheduledDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time Slot</p>
                    <p className="font-semibold">{selectedBooking.timeSlot || 'TBD'}</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {selectedBooking.finalQuote && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-green-900 mb-3">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Deposit Amount:</span>
                      <span className="font-semibold">£{(selectedBooking.finalQuote.depositAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Total Amount:</span>
                      <span className="font-semibold">£{selectedBooking.finalQuote.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Remaining Balance:</span>
                      <span className="font-semibold">£{(selectedBooking.finalQuote.totalAmount - (selectedBooking.finalQuote.depositAmount || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
                {canCancelBooking(selectedBooking) && (
                  <button
                    onClick={() => {
                      setShowCancelModal(true);
                    }}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={20} />
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && selectedBooking && (
        <ClientBookingCancel
          job={selectedBooking}
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedBooking(null);
          }}
          onCancelSuccess={handleCancelSuccess}
        />
      )}
    </div>
  );
};