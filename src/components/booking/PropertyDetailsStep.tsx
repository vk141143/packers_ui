import React from 'react';

interface PropertyDetailsStepProps {
  data: {
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    hasElevator: boolean;
    hasParking: boolean;
    specialInstructions: string;
  };
  onUpdate: (data: Partial<PropertyDetailsStepProps['data']>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Property Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Property Type</label>
          <select
            value={data.propertyType}
            onChange={(e) => onUpdate({ propertyType: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Select property type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="office">Office</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Bedrooms</label>
            <input
              type="number"
              value={data.bedrooms}
              onChange={(e) => onUpdate({ bedrooms: parseInt(e.target.value) || 0 })}
              className="w-full p-3 border rounded-lg"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bathrooms</label>
            <input
              type="number"
              value={data.bathrooms}
              onChange={(e) => onUpdate({ bathrooms: parseInt(e.target.value) || 0 })}
              className="w-full p-3 border rounded-lg"
              min="0"
              step="0.5"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Square Footage</label>
          <input
            type="number"
            value={data.squareFootage}
            onChange={(e) => onUpdate({ squareFootage: parseInt(e.target.value) || 0 })}
            className="w-full p-3 border rounded-lg"
            min="0"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.hasElevator}
              onChange={(e) => onUpdate({ hasElevator: e.target.checked })}
              className="mr-2"
            />
            Has Elevator
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.hasParking}
              onChange={(e) => onUpdate({ hasParking: e.target.checked })}
              className="mr-2"
            />
            Has Parking Available
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Special Instructions</label>
          <textarea
            value={data.specialInstructions}
            onChange={(e) => onUpdate({ specialInstructions: e.target.value })}
            className="w-full p-3 border rounded-lg h-24"
            placeholder="Any special instructions or notes..."
          />
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};