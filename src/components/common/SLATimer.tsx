import React from 'react';

interface SLATimerProps {
  deadline?: string;
}

export const SLATimer: React.FC<SLATimerProps> = ({ deadline }) => {
  if (!deadline) {
    return <span className="text-gray-500 text-sm">No deadline</span>;
  }

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  
  if (diff <= 0) {
    return <span className="text-red-600 text-sm font-semibold">⏰ Overdue</span>;
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return (
    <span className="text-blue-600 text-sm font-semibold">
      {hours}h {minutes}m
    </span>
  );
};