import React, { useState } from 'react';
import { BookingForm } from './BookingForm';
import { BookingConfirmation } from './BookingConfirmation';
import { BookingList } from './BookingList';
import { bookingFlowStore } from './store';
import { BookingRequest } from './types';
import { Package, List, Plus } from 'lucide-react';

type ViewMode = 'form' | 'confirmation' | 'list';

export const BookingFlow: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('form');
  const [currentBooking, setCurrentBooking] = useState<BookingRequest | null>(null);

  const handleBookingSuccess = (bookingId: string) => {
    const booking = bookingFlowStore.getBookingById(bookingId);
    if (booking) {
      setCurrentBooking(booking);
      setCurrentView('confirmation');
    }
  };

  const handleNewBooking = () => {
    setCurrentBooking(null);
    setCurrentView('form');
  };

  const handleViewList = () => {
    setCurrentView('list');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Booking System</h1>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleNewBooking}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  currentView === 'form'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                New Booking
              </button>
              
              <button
                onClick={handleViewList}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  currentView === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" />
                View All
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {currentView === 'form' && (
          <BookingForm onSuccess={handleBookingSuccess} />
        )}
        
        {currentView === 'confirmation' && currentBooking && (
          <BookingConfirmation 
            booking={currentBooking} 
            onNewBooking={handleNewBooking}
          />
        )}
        
        {currentView === 'list' && (
          <BookingList />
        )}
      </main>
    </div>
  );
};