import React from 'react';

interface DraftBooking {
  accessConstraints: string[];
}

interface AccessStepProps {
  draftBooking: DraftBooking;
  updateDraftBooking: (updates: Partial<DraftBooking>) => void;
  onNext: () => void;
}

export const AccessStep: React.FC<AccessStepProps> = ({ draftBooking, updateDraftBooking, onNext }) => {
  const accessOptions = [
    'Narrow stairs', 'No elevator', 'Parking restrictions', 'Long carry distance',
    'Heavy items', 'Fragile items', 'Time restrictions', 'No access constraints'
  ];

  const handleAccessToggle = (constraint: string) => {
    const updatedConstraints = draftBooking.accessConstraints.includes(constraint)
      ? draftBooking.accessConstraints.filter(c => c !== constraint)
      : [...draftBooking.accessConstraints, constraint];
    updateDraftBooking({ accessConstraints: updatedConstraints });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Access & Constraints</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Any access challenges?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accessOptions.map((constraint) => (
              <button
                key={constraint}
                onClick={() => handleAccessToggle(constraint)}
                className={`p-3 rounded-xl border transition-all text-left ${
                  draftBooking.accessConstraints.includes(constraint)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                {constraint}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};