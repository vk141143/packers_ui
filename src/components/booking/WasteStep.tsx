import React from 'react';

interface DraftBooking {
  wasteTypes: string[];
  volumeEstimate: number;
}

interface WasteStepProps {
  draftBooking: DraftBooking;
  updateDraftBooking: (updates: Partial<DraftBooking>) => void;
  onNext: () => void;
}

export const WasteStep: React.FC<WasteStepProps> = ({ draftBooking, updateDraftBooking, onNext }) => {
  const wasteOptions = [
    'Furniture', 'Appliances', 'Electronics', 'Clothing', 'Books/Papers', 
    'Garden Waste', 'Construction Debris', 'Hazardous Materials'
  ];

  const handleWasteTypeToggle = (wasteType: string) => {
    const updatedTypes = draftBooking.wasteTypes.includes(wasteType)
      ? draftBooking.wasteTypes.filter(type => type !== wasteType)
      : [...draftBooking.wasteTypes, wasteType];
    updateDraftBooking({ wasteTypes: updatedTypes });
  };

  const handleVolumeChange = (volume: number) => {
    updateDraftBooking({ volumeEstimate: volume });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Waste Assessment</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">What types of waste need clearing?</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {wasteOptions.map((type) => (
              <button
                key={type}
                onClick={() => handleWasteTypeToggle(type)}
                className={`p-3 rounded-xl border transition-all ${
                  draftBooking.wasteTypes.includes(type)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Estimated Volume (van loads)</h3>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((volume) => (
              <button
                key={volume}
                onClick={() => handleVolumeChange(volume)}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  draftBooking.volumeEstimate === volume
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                {volume} {volume === 1 ? 'load' : 'loads'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};