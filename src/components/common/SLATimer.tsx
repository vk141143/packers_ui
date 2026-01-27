import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { calculateSLARemaining, getSLAStatus } from '../../utils/helpers';

interface SLATimerProps {
  deadline: string;
}

export const SLATimer: React.FC<SLATimerProps> = ({ deadline }) => {
  const [remaining, setRemaining] = useState(() => calculateSLARemaining(deadline));
  const [status, setStatus] = useState(() => getSLAStatus(deadline));

  useEffect(() => {
    const updateTimer = () => {
      setRemaining(calculateSLARemaining(deadline));
      setStatus(getSLAStatus(deadline));
    };

    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [deadline]);

  const statusColors = {
    safe: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    critical: 'text-red-600 bg-red-50',
  };

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded ${statusColors[status]}`}>
      <Clock size={14} />
      <span className="text-xs font-medium">{remaining}</span>
    </div>
  );
};
