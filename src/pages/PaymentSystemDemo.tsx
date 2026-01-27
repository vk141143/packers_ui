import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FinalPriceSection, EnhancedJobDetails } from '../components/common';
import { Calculator, CheckCircle, CreditCard } from 'lucide-react';

const mockJob = {
  id: 'demo-001',
  immutableReferenceId: 'REF-2024-001',
  pickupAddress: '123 Demo Street, London SW1A 1AA',
  dropoffAddress: '456 Example Road, Manchester M1 1AA',
  scheduledDate: new Date().toISOString(),
  status: 'in-progress' as const,
  lifecycleState: 'in-progress' as const,
  slaDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
  crewAssigned: ['Demo Crew'],
  estimatedPrice: 450,
  finalPrice: 520,
  depositPaid: 135,
  remainingBalance: 385,
  items: [
    { name: 'Sofa (3-seater)', quantity: 1, price: 85 },
    { name: 'Dining Table', quantity: 1, price: 65 },
    { name: 'Wardrobe (Large)', quantity: 2, price: 120 },
    { name: 'Boxes (Medium)', quantity: 8, price: 25 },
    { name: 'Stairs Access Fee', quantity: 1, price: 45 },
    { name: 'Long Carry Fee', quantity: 1, price: 30 },
    { name: 'Packaging Materials', quantity: 1, price: 35 },
    { name: 'Disposal Fee', quantity: 1, price: 85 }
  ],
  paymentBreakdown: {
    subtotal: 490,
    vat: 30,
    total: 520,
    depositPaid: 135,
    remainingBalance: 385
  }
};

export const PaymentSystemDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calculation' | 'payment'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment System Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Demonstrating the corrected payment calculation system with accurate pricing, 
            deposit handling, and final payment processing.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg">
            {[
              { id: 'overview', label: 'Job Overview', icon: CheckCircle },
              { id: 'calculation', label: 'Price Calculation', icon: Calculator },
              { id: 'payment', label: 'Payment Processing', icon: CreditCard }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeTab === id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Enhanced Job Details</h2>
              <EnhancedJobDetails job={mockJob} />
            </div>
          )}

          {activeTab === 'calculation' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Price Calculation Breakdown</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Item Breakdown</h3>
                  <div className="space-y-3">
                    {mockJob.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{item.name}</span>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                          <div className="font-semibold">£{item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-semibold">£{mockJob.paymentBreakdown.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT (20%):</span>
                        <span className="font-semibold">£{mockJob.paymentBreakdown.vat}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>£{mockJob.paymentBreakdown.total}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-green-600">
                          <span>Deposit Paid:</span>
                          <span className="font-semibold">-£{mockJob.paymentBreakdown.depositPaid}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-blue-600 mt-2">
                          <span>Remaining Balance:</span>
                          <span>£{mockJob.paymentBreakdown.remainingBalance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Final Payment Processing</h2>
              <FinalPriceSection 
                job={mockJob}
                onPaymentComplete={(amount) => {
                  console.log('Payment completed:', amount);
                  alert(`Payment of £${amount} processed successfully!`);
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Key Payment System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Accurate Calculations</h3>
              <p className="text-sm text-gray-600">Precise item-by-item pricing with proper VAT handling</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Deposit Management</h3>
              <p className="text-sm text-gray-600">Proper tracking of deposits and remaining balances</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure Processing</h3>
              <p className="text-sm text-gray-600">Safe and reliable payment processing workflow</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};