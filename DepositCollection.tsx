import React, { useState } from 'react';

interface DepositCollectionProps {
  quoteId: string;
  depositAmount: number;
  onPaymentComplete: (paymentId: string) => void;
}

export const DepositCollection: React.FC<DepositCollectionProps> = ({
  quoteId,
  depositAmount,
  onPaymentComplete
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/payments/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId,
          amount: depositAmount,
          paymentMethod
        })
      });
      
      const { paymentId } = await response.json();
      onPaymentComplete(paymentId);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="deposit-collection">
      <h3>Secure Your Booking</h3>
      <p>Deposit Required: ${depositAmount}</p>
      
      <div className="payment-methods">
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Credit/Debit Card
        </label>
        <label>
          <input
            type="radio"
            value="bank"
            checked={paymentMethod === 'bank'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Bank Transfer
        </label>
      </div>

      <button 
        onClick={handlePayment}
        disabled={processing}
        className="pay-deposit-btn"
      >
        {processing ? 'Processing...' : `Pay $${depositAmount} Deposit`}
      </button>
    </div>
  );
};