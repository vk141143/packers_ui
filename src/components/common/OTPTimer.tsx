import React, { useState, useEffect } from 'react';

interface OTPTimerProps {
  onResend: () => void;
  initialTime?: number;
}

export const OTPTimer: React.FC<OTPTimerProps> = ({ onResend, initialTime = 75 }) => {
  const [timer, setTimer] = useState(initialTime);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) setCanResend(true);
  }, [timer]);

  const handleResend = () => {
    setTimer(initialTime);
    setCanResend(false);
    onResend();
  };

  return (
    <div className="text-center text-sm">
      {!canResend ? (
        <p className="text-gray-600">Resend OTP in {timer}s</p>
      ) : (
        <button 
          type="button" 
          onClick={handleResend} 
          className="text-blue-600 font-semibold hover:underline"
        >
          Resend OTP
        </button>
      )}
    </div>
  );
};