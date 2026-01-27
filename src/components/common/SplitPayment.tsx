import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Loader2, Receipt, DollarSign } from 'lucide-react';
import { Job } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface SplitPaymentProps {
  job: Job;
  onFinalPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export const SplitPayment: React.FC<SplitPaymentProps> = ({ 
  job, 
  onFinalPaymentSuccess, 
  onPaymentError 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay' | 'google-pay'>('card');

  const totalAmount = job.finalQuote?.fixedPrice || 0;
  const depositPaid = job.depositAmount || 0;
  const remainingBalance = totalAmount - depositPaid;

  const handleFinalPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        transactionId: `TXN-FINAL-${Date.now()}`,
        amount: remainingBalance,
        method: paymentMethod,
        paidAt: new Date().toISOString(),
        status: 'success',
        type: 'final_balance'
      };
      
      onFinalPaymentSuccess(paymentData);
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Final Payment Required</h2>
          <p className="text-blue-100">Work completed - pay remaining balance</p>
        </div>

        {/* Job Completion Summary */}
        <div className="p-6 border-b bg-green-50">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-green-800">Work Completed Successfully</h3>
          </div>
          
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
              <span>Completed:</span>
              <span className="font-medium">
                {job.completedAt ? new Date(job.completedAt).toLocaleDateString() : 'Recently'}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Payment Summary
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Total Service Cost</span>
              <span className="font-semibold">{formatCurrency(totalAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 text-green-700">
              <span>Deposit Paid</span>
              <span className="font-semibold">-{formatCurrency(depositPaid)}</span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Remaining Balance</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(remainingBalance)}
                </span>
              </div>
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
                className="w-4 h-4 text-blue-600"
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
                className="w-4 h-4 text-blue-600"
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
                className="w-4 h-4 text-blue-600"
              />
              <div className="w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                G
              </div>
              <span>Google Pay</span>
            </label>
          </div>
        </div>

        {/* Work Verification */}
        <div className="p-6 border-b bg-gray-50">
          <h4 className="font-semibold text-gray-900 mb-3">Work Verification</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Work completed by crew</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Quality verified by operations team</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Compliance documentation generated</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="p-6">
          <motion.button
            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
            whileTap={{ scale: isProcessing ? 1 : 0.98 }}
            onClick={handleFinalPayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Final Payment...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                Pay Final Balance {formatCurrency(remainingBalance)}
              </>
            )}
          </motion.button>
          
          <p className="text-xs text-gray-600 text-center mt-3">
            After payment, you'll receive your final invoice and completion certificate
          </p>
        </div>
      </div>
    </div>
  );
};