import React, { useState } from 'react';
import { Navigation, MapPin } from 'lucide-react';

interface LocationMapProps {
  onLocationSelect?: (address: string, coordinates: [number, number]) => void;
  className?: string;
  height?: string;
}

export const LocationMap: React.FC<LocationMapProps> = ({ 
  onLocationSelect, 
  className = '',
  height = '400px'
}) => {
  const [currentAddress, setCurrentAddress] = useState<string>('');

  const findMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
          const address = `${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`;
          setCurrentAddress(address);
          onLocationSelect?.(address, coords);
        },
        (error) => console.error('Location error:', error)
      );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div style={{ height }} className="w-full rounded-xl bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Map view disabled</p>
      </div>
      
      {/* Find My Location Button */}
      <button
        onClick={findMyLocation}
        className="absolute top-4 left-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-3 shadow-lg transition-colors z-10"
        title="Find my location"
      >
        <Navigation className="w-5 h-5 text-blue-600" />
      </button>

      {/* Current Address Display */}
      {currentAddress && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-lg z-10">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Selected Location</p>
              <p className="text-xs text-gray-600">{currentAddress}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};