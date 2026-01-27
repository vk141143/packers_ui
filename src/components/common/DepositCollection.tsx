import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Job } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { useStatusPopup } from './StatusPopupManager';

interface DepositCollectionProps {
  job: Job;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export const DepositCollection: React.FC<DepositCollectionProps> = ({ 
  job, 
  onPaymentSuccess, 
  onPaymentError 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay' | 'google-pay'>('card');
  const { showStatus, StatusPopup } = useStatusPopup();
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const depositAmount = job.finalQuote?.depositAmount || 0;
  const remainingBalance = (job.finalQuote?.fixedPrice || 0) - depositAmount;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        transactionId: `TXN-${Date.now()}`,
        amount: depositAmount,
        method: paymentMethod,
        paidAt: new Date().toISOString(),
        status: 'success'
      };
      
      showStatus('payment-success');
      onPaymentSuccess(paymentData);
    } catch (error) {
      onPaymentError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Secure Your Booking</h2>
          <p className="text-green-100">Deposit payment required to proceed</p>
        </div>

        {/* Booking Summary */}
        <div className="p-6 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Job ID:</span>
              <span className="font-medium">{job.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Service:</span>
              <span className="font-medium">{job.serviceType.replace('-', ' ').toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Price:</span>
              <span className="font-medium">{formatCurrency(job.finalQuote?.fixedPrice || 0)}</span>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
          
          <div className="space-y-3">
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-800">Deposit Due Now</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(depositAmount)}
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Secures your booking and crew assignment
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Remaining Balance</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(remainingBalance)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Due after work completion
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-4 h-4 text-green-600"
              />
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span>Credit/Debit Card</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="apple-pay"
                checked={paymentMethod === 'apple-pay'}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-4 h-4 text-green-600"
              />
              <div className="w-5 h-5 bg-black rounded text-white text-xs flex items-center justify-center">
                
              </div>
              <span>Apple Pay</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="google-pay"
                checked={paymentMethod === 'google-pay'}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-4 h-4 text-green-600"
              />
              <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                G
              </div>
              <span>Google Pay</span>
            </label>
          </div>
        </div>

        {/* Card Details (if card selected) */}
        {paymentMethod === 'card' && (
          <div className="p-6 border-b">
            <h4 className="font-semibold text-gray-900 mb-4">Card Details</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="MM/YY"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="p-6 border-b bg-blue-50">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Secure Payment</p>
              <p className="text-blue-700">
                Your payment is processed securely. We never store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="p-6">
          <motion.button
            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
            whileTap={{ scale: isProcessing ? 1 : 0.98 }}
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Pay Deposit {formatCurrency(depositAmount)}
              </>
            )}
          </motion.button>
          
          <p className="text-xs text-gray-600 text-center mt-3">
            By proceeding, you agree to our terms and conditions
          </p>
        </div>
      </div>
      <StatusPopup />
    </div>
  );
};