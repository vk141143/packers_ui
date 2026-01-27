import React, { useState } from 'react';
import { RequestQuoteWidget } from './RequestQuoteWidget';
import { QuoteApproval } from './QuoteApproval';
import { DepositCollection } from './DepositCollection';
import { Scheduling } from './Scheduling';

type WorkflowStep = 'request' | 'pending' | 'approval' | 'deposit' | 'scheduling' | 'complete';

export const BookingWorkflow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('request');
  const [quoteData, setQuoteData] = useState<any>(null);

  const handleQuoteSubmitted = (data: any) => {
    setQuoteData(data);
    setCurrentStep('pending');
  };

  const handleQuoteApproved = (quote: any) => {
    setQuoteData(quote);
    setCurrentStep('deposit');
  };

  const handleDepositPaid = () => {
    setCurrentStep('scheduling');
  };

  const handleScheduleConfirmed = () => {
    setCurrentStep('complete');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'request':
        return <RequestQuoteWidget onQuoteSubmitted={handleQuoteSubmitted} />;
      
      case 'pending':
        return (
          <div className="pending-review">
            <h3>Quote Under Review</h3>
            <p>Our operations team is reviewing your request. You'll receive a quote within 24 hours.</p>
          </div>
        );
      
      case 'approval':
        return (
          <QuoteApproval 
            quote={quoteData} 
            onApproval={handleQuoteApproved}
          />
        );
      
      case 'deposit':
        return (
          <DepositCollection
            quoteId={quoteData.id}
            depositAmount={quoteData.depositAmount}
            onPaymentComplete={handleDepositPaid}
          />
        );
      
      case 'scheduling':
        return (
          <Scheduling
            quoteId={quoteData.id}
            onScheduleConfirmed={handleScheduleConfirmed}
          />
        );
      
      case 'complete':
        return (
          <div className="booking-complete">
            <h3>Booking Confirmed!</h3>
            <p>Your move is scheduled. Check your email for details.</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="booking-workflow">
      <div className="progress-bar">
        <div className={`step ${currentStep === 'request' ? 'active' : 'completed'}`}>Request</div>
        <div className={`step ${currentStep === 'pending' ? 'active' : currentStep === 'request' ? 'pending' : 'completed'}`}>Review</div>
        <div className={`step ${currentStep === 'approval' ? 'active' : ['request', 'pending'].includes(currentStep) ? 'pending' : 'completed'}`}>Quote</div>
        <div className={`step ${currentStep === 'deposit' ? 'active' : ['request', 'pending', 'approval'].includes(currentStep) ? 'pending' : 'completed'}`}>Deposit</div>
        <div className={`step ${currentStep === 'scheduling' ? 'active' : currentStep === 'complete' ? 'completed' : 'pending'}`}>Schedule</div>
      </div>
      
      {renderStep()}
    </div>
  );
};