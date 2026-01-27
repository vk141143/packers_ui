import React from 'react';

interface PaymentNotificationProps {
  dueDate: string;
  amount: number;
  isVerified: boolean;
  bookingId: string;
}

const ClientPaymentNotification: React.FC<PaymentNotificationProps> = ({
  dueDate,
  amount,
  isVerified,
  bookingId
}) => {
  if (!isVerified) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = new Date(dueDate) < new Date();

  return (
    <div className={`p-4 rounded-lg border-l-4 ${
      isOverdue ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'
    }`}>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-3 ${
          isOverdue ? 'bg-red-500' : 'bg-blue-500'
        }`} />
        <div>
          <h3 className={`font-semibold ${
            isOverdue ? 'text-red-800' : 'text-blue-800'
          }`}>
            {isOverdue ? 'Payment Overdue' : 'Payment Due'}
          </h3>
          <p className="text-sm text-gray-600">
            Booking #{bookingId}
          </p>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-sm">
          <span className="font-medium">Amount:</span> ${amount.toFixed(2)}
        </p>
        <p className="text-sm">
          <span className="font-medium">Due Date:</span> {formatDate(dueDate)}
        </p>
      </div>

      <button className={`mt-4 px-4 py-2 rounded text-white text-sm font-medium ${
        isOverdue 
          ? 'bg-red-600 hover:bg-red-700' 
          : 'bg-blue-600 hover:bg-blue-700'
      }`}>
        Pay Now
      </button>
    </div>
  );
};

export default ClientPaymentNotification;