import React, { useState } from 'react';
import { calculateDetailedPrice, PricingOptions, PricingComponents } from '../../utils/detailedPricing';
import { Calculator, Home, Truck, Trash, Stairs, Clock, FileText } from 'lucide-react';

export const DetailedPriceEstimator: React.FC = () => {
  const [options, setOptions] = useState<PricingOptions>({
    propertySize: '2bed',
    volumeLoads: 2,
    wasteTypes: ['general'],
    accessDifficulties: ['ground'],
    urgency: 'standard',
    complianceAddOns: ['photos'],
    furnitureItems: 0
  });

  const [estimate, setEstimate] = useState<PricingComponents | null>(null);

  const handleCalculate = () => {
    const result = calculateDetailedPrice(options);
    setEstimate(result);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold">Detailed Price Calculator</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Property Size */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <Home className="w-4 h-4" />
              Property Size
            </label>
            <select
              value={options.propertySize}
              onChange={(e) => setOptions({...options, propertySize: e.target.value as any})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="studio">Studio / 1-bed flat (+£100)</option>
              <option value="2bed">2-bed flat (+£200)</option>
              <option value="3bed">3-bed house (+£350)</option>
              <option value="4bed">4+ bed house (+£500)</option>
            </select>
          </div>

          {/* Volume Loads */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <Truck className="w-4 h-4" />
              Van Loads
            </label>
            <select
              value={options.volumeLoads}
              onChange={(e) => setOptions({...options, volumeLoads: parseInt(e.target.value)})}
              className="w-full p-3 border rounded-lg"
            >
              <option value={1}>1 van load (+£150)</option>
              <option value={2}>2 van loads (+£300)</option>
              <option value={3}>3 van loads (+£450)</option>
              <option value={4}>4+ van loads (+£600)</option>
            </select>
          </div>

          {/* Waste Types */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <Trash className="w-4 h-4" />
              Waste Types
            </label>
            <div className="space-y-2">
              {[
                { id: 'general', label: 'General waste (+£0)' },
                { id: 'furniture', label: 'Furniture / white goods (+£50 per item)' },
                { id: 'garden', label: 'Garden waste (+£100)' },
                { id: 'construction', label: 'Construction waste (+£200)' },
                { id: 'hazardous', label: 'Hazardous / hoarder waste (+£300)' }
              ].map(waste => (
                <label key={waste.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={options.wasteTypes.includes(waste.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOptions({...options, wasteTypes: [...options.wasteTypes, waste.id]});
                      } else {
                        setOptions({...options, wasteTypes: options.wasteTypes.filter(w => w !== waste.id)});
                      }
                    }}
                  />
                  <span className="text-sm">{waste.label}</span>
                </label>
              ))}
            </div>
            {options.wasteTypes.includes('furniture') && (
              <input
                type="number"
                placeholder="Number of furniture items"
                value={options.furnitureItems || 0}
                onChange={(e) => setOptions({...options, furnitureItems: parseInt(e.target.value) || 0})}
                className="w-full p-2 border rounded mt-2"
                min="0"
              />
            )}
          </div>

          {/* Access Difficulty */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <Stairs className="w-4 h-4" />
              Access Difficulty
            </label>
            <div className="space-y-2">
              {[
                { id: 'ground', label: 'Ground floor (+£0)' },
                { id: 'stairs', label: 'Stairs (no lift) (+£100)' },
                { id: 'parking', label: 'Restricted parking (+£100)' },
                { id: 'distance', label: 'Long carry distance (+£100)' }
              ].map(access => (
                <label key={access.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={options.accessDifficulties.includes(access.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOptions({...options, accessDifficulties: [...options.accessDifficulties, access.id]});
                      } else {
                        setOptions({...options, accessDifficulties: options.accessDifficulties.filter(a => a !== access.id)});
                      }
                    }}
                  />
                  <span className="text-sm">{access.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Urgency */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <Clock className="w-4 h-4" />
              Service Urgency
            </label>
            <select
              value={options.urgency}
              onChange={(e) => setOptions({...options, urgency: e.target.value as any})}
              className="w-full p-3 border rounded-lg"
            >
              <option value="standard">Standard 48-hour (+£0)</option>
              <option value="24h">24-hour emergency (+£150)</option>
              <option value="same-day">Same-day emergency (+£300)</option>
            </select>
          </div>

          {/* Compliance Add-ons */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
              <FileText className="w-4 h-4" />
              Compliance Add-ons
            </label>
            <div className="space-y-2">
              {[
                { id: 'photos', label: 'Photo report (+£50)' },
                { id: 'council', label: 'Council compliance pack (+£100)' },
                { id: 'sanitation', label: 'Deep sanitation / bio clean (+£250)' }
              ].map(addon => (
                <label key={addon.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={options.complianceAddOns.includes(addon.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOptions({...options, complianceAddOns: [...options.complianceAddOns, addon.id]});
                      } else {
                        setOptions({...options, complianceAddOns: options.complianceAddOns.filter(a => a !== addon.id)});
                      }
                    }}
                  />
                  <span className="text-sm">{addon.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Calculate Price
          </button>

          {/* Price Breakdown */}
          {estimate && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Call-Out Fee:</span>
                  <span>£{estimate.baseCallOut}</span>
                </div>
                <div className="flex justify-between">
                  <span>Property Size:</span>
                  <span>£{estimate.propertySize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume/Load:</span>
                  <span>£{estimate.volumeLoad}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waste Type:</span>
                  <span>£{estimate.wasteType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Access Difficulty:</span>
                  <span>£{estimate.accessDifficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span>Urgency:</span>
                  <span>£{estimate.urgency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Compliance Add-ons:</span>
                  <span>£{estimate.complianceAddOns}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>£{estimate.total}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Minimum charge: £350
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};