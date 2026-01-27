import React, { useState } from 'react';
import { BookingDashboardWithCancellation } from '../components/common/BookingDashboardWithCancellation';
import { Job } from '../types';

// Mock data for demonstration
const mockBookings: Job[] = [
  {
    id: '1',
    immutableReferenceId: 'BK-2024-001',
    clientName: 'John Smith',
    serviceType: 'house-clearance',
    status: 'client-approved',
    scheduledDate: '2024-02-15',
    timeSlot: '09:00 - 12:00',
    location: {
      address: '123 Main Street, London, SW1A 1AA',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    finalQuote: {
      totalAmount: 450.00,
      depositAmount: 135.00,
      breakdown: [
        { item: 'House Clearance Service', quantity: 1, rate: 450.00, total: 450.00 }
      ]
    },
    initialPayment: {
      amount: 135.00,
      status: 'completed',
      method: 'card',
      transactionId: 'txn_123456'
    }
  },
  {
    id: '2',
    immutableReferenceId: 'BK-2024-002',
    clientName: 'Sarah Johnson',
    serviceType: 'office-clearance',
    status: 'admin-quoted',
    scheduledDate: '2024-02-20',
    timeSlot: '14:00 - 17:00',
    location: {
      address: '456 Business Park, Manchester, M1 1AA',
      coordinates: { lat: 53.4808, lng: -2.2426 }
    },
    finalQuote: {
      totalAmount: 680.00,
      depositAmount: 204.00,
      breakdown: [
        { item: 'Office Clearance Service', quantity: 1, rate: 680.00, total: 680.00 }
      ]
    }
  },
  {
    id: '3',
    immutableReferenceId: 'BK-2024-003',
    clientName: 'Mike Wilson',
    serviceType: 'garden-clearance',
    status: 'work-completed',
    scheduledDate: '2024-01-25',
    timeSlot: '10:00 - 15:00',
    location: {
      address: '789 Garden Lane, Birmingham, B1 1AA',
      coordinates: { lat: 52.4862, lng: -1.8904 }
    },
    finalQuote: {
      totalAmount: 320.00,
      depositAmount: 96.00,
      breakdown: [
        { item: 'Garden Clearance Service', quantity: 1, rate: 320.00, total: 320.00 }
      ]
    },
    initialPayment: {
      amount: 96.00,
      status: 'completed',
      method: 'card',
      transactionId: 'txn_789012'
    }
  },
  {
    id: '4',
    immutableReferenceId: 'BK-2024-004',
    clientName: 'Emma Davis',
    serviceType: 'waste-removal',
    status: 'cancelled',
    scheduledDate: '2024-02-10',
    timeSlot: '08:00 - 11:00',
    location: {
      address: '321 Residential Road, Leeds, LS1 1AA',
      coordinates: { lat: 53.8008, lng: -1.5491 }
    },
    finalQuote: {
      totalAmount: 180.00,
      depositAmount: 54.00,
      breakdown: [
        { item: 'Waste Removal Service', quantity: 1, rate: 180.00, total: 180.00 }
      ]
    },
    cancellationReason: 'Change of plans',
    refundAmount: 54.00,
    refundStatus: 'completed'
  },
  {
    id: '5',
    immutableReferenceId: 'BK-2024-005',
    clientName: 'David Brown',
    serviceType: 'house-clearance',
    status: 'in-progress',
    scheduledDate: '2024-02-12',
    timeSlot: '13:00 - 18:00',
    location: {
      address: '654 Suburban Avenue, Liverpool, L1 1AA',
      coordinates: { lat: 53.4084, lng: -2.9916 }
    },
    finalQuote: {
      totalAmount: 520.00,
      depositAmount: 156.00,
      breakdown: [
        { item: 'House Clearance Service', quantity: 1, rate: 520.00, total: 520.00 }
      ]
    },
    initialPayment: {
      amount: 156.00,
      status: 'completed',
      method: 'card',
      transactionId: 'txn_345678'
    }
  }
];

export const BookingDashboardDemo: React.FC = () => {
  const [bookings, setBookings] = useState<Job[]>(mockBookings);

  const handleBookingUpdate = (bookingId: string) => {
    // Simulate booking update (e.g., status change to cancelled)
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as any }
          : booking
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Dashboard Demo</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive booking management with integrated deposit cancellation flow
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Demo Mode
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features Demonstrated</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Smart Cancellation</h3>
              <p className="text-sm text-blue-700">
                Different flows for bookings with and without deposits
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Refund Calculation</h3>
              <p className="text-sm text-green-700">
                Automatic refund calculation based on timing and policies
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Multi-Step Process</h3>
              <p className="text-sm text-purple-700">
                Guided cancellation with terms, reason, and confirmation
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">Status Management</h3>
              <p className="text-sm text-orange-700">
                Real-time status updates and filtering options
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <h3 className="font-bold text-yellow-900 mb-3">How to Test the Cancellation Flow</h3>
          <div className="space-y-2 text-sm text-yellow-800">
            <p>• <strong>With Deposit:</strong> Try cancelling "BK-2024-001" (John Smith) - uses enhanced DepositCancellationModal</p>
            <p>• <strong>Without Deposit:</strong> Try cancelling "BK-2024-002" (Sarah Johnson) - uses standard cancellation flow</p>
            <p>• <strong>Cannot Cancel:</strong> "BK-2024-005" (David Brown) is in-progress and cannot be cancelled</p>
            <p>• <strong>Already Cancelled:</strong> "BK-2024-004" (Emma Davis) shows completed cancellation with refund</p>
          </div>
        </div>

        {/* Dashboard Component */}
        <BookingDashboardWithCancellation 
          bookings={bookings}
          onBookingUpdate={handleBookingUpdate}
        />
      </div>

      {/* Technical Notes */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gray-900 text-white rounded-xl p-6">
          <h3 className="font-bold mb-4">Technical Implementation Notes</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Components Used:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• BookingDashboardWithCancellation</li>
                <li>• ClientBookingCancel</li>
                <li>• DepositCancellationModal</li>
                <li>• useCancellationFlow hook</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-2">Key Features:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Conditional modal rendering</li>
                <li>• Multi-step cancellation process</li>
                <li>• Refund policy calculation</li>
                <li>• Real-time status updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};