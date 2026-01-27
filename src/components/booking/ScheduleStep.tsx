import React from 'react';

interface DraftBooking {
  preferredDates: string[];
  urgencyLevel: 'standard' | 'urgent' | 'emergency';
}

interface ScheduleStepProps {
  draftBooking: DraftBooking;
  updateDraftBooking: (updates: Partial<DraftBooking>) => void;
  onNext: () => void;
}

export const ScheduleStep: React.FC<ScheduleStepProps> = ({ draftBooking, updateDraftBooking, onNext }) => {
  const urgencyOptions = [
    { value: 'standard', label: 'Standard (7-14 days)' },
    { value: 'urgent', label: 'Urgent (2-7 days)' },
    { value: 'emergency', label: 'Emergency (24-48 hours)' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Schedule Preferences</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Urgency Level</h3>
          <div className="space-y-3">
            {urgencyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateDraftBooking({ urgencyLevel: option.value as any })}
                className={`w-full p-3 rounded-xl border transition-all text-left ${
                  draftBooking.urgencyLevel === option.value
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};