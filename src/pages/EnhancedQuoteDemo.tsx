import React, { useState } from 'react';
import { EnhancedBookingForm } from '../components/common/EnhancedBookingForm';
import { EnhancedQuoteCalculator } from '../services/enhancedQuoteCalculator';
import { EnhancedBookingData, DetailedQuote } from '../types/enhancedBooking';
import { CheckCircle, Clock, Users, Truck, Package, FileText, ArrowLeft } from 'lucide-react';

export const EnhancedQuoteDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<'form' | 'quote'>('form');
  const [generatedQuote, setGeneratedQuote] = useState<DetailedQuote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBookingSubmit = async (bookingData: EnhancedBookingData) => {
    setIsGenerating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const quote = EnhancedQuoteCalculator.calculateQuote(bookingData);
      setGeneratedQuote(quote);
      setCurrentView('quote');
    } catch (error) {
      console.error('Error generating quote:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'base': 'bg-blue-100 text-blue-800',
      'volume': 'bg-green-100 text-green-800',
      'urgency': 'bg-orange-100 text-orange-800',
      'access': 'bg-purple-100 text-purple-800',
      'special-items': 'bg-red-100 text-red-800',
      'packing': 'bg-indigo-100 text-indigo-800',
      'storage': 'bg-yellow-100 text-yellow-800',
      'distance': 'bg-gray-100 text-gray-800',
      'discount': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Quote</h2>
          <p className="text-gray-600">Analyzing your requirements and calculating pricing...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'quote' && generatedQuote) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => setCurrentView('form')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Form
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Your Detailed Quote</h1>
            <p className="text-gray-600 mt-2">Quote ID: {generatedQuote.id}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quote Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Price Summary */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Quote Summary</h2>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(generatedQuote.totalPrice)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Valid until {new Date(generatedQuote.validUntil).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-medium">{generatedQuote.estimatedDuration}</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="text-sm font-medium">{generatedQuote.crewSize} people</div>
                    <div className="text-xs text-gray-500">Crew Size</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Truck className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-sm font-medium">{generatedQuote.vehicleType}</div>
                    <div className="text-xs text-gray-500">Vehicle</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Package className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                    <div className="text-sm font-medium">{generatedQuote.additionalServices.length}</div>
                    <div className="text-xs text-gray-500">Add-ons</div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
                <div className="space-y-3">
                  {generatedQuote.breakdown.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.description}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                        {item.notes && (
                          <div className="text-sm text-gray-500 mt-1">{item.notes}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(item.total)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-gray-500">
                            {item.quantity} × {formatCurrency(item.unitPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">{formatCurrency(generatedQuote.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              {generatedQuote.additionalServices.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4">Included Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedQuote.additionalServices.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Details */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {generatedQuote.bookingData.contactInfo.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {generatedQuote.bookingData.contactInfo.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> {generatedQuote.bookingData.contactInfo.phone}
                  </div>
                  <div>
                    <span className="font-medium">Service:</span> {generatedQuote.bookingData.serviceRequirements.serviceType.replace('-', ' ')}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {new Date(generatedQuote.bookingData.bookingDetails.preferredDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Terms & Conditions
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {generatedQuote.terms.map((term, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{term}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-medium">
                  Accept Quote & Book
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium">
                  Download PDF
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 font-medium">
                  Request Modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Enhanced Quote Calculator Demo</h1>
          <p className="text-lg text-gray-600">
            Experience our comprehensive booking form and instant quote generation
          </p>
        </div>

        <EnhancedBookingForm onSubmit={handleBookingSubmit} />
      </div>
    </div>
  );
};