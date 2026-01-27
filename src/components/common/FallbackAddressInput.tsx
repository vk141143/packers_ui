import React, { useState } from 'react';
import { MapPin, Navigation, AlertCircle, Wifi, Smartphone } from 'lucide-react';
import { networkLocationService } from '../../services/networkLocationService';

interface FallbackAddressInputProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const FallbackAddressInput: React.FC<FallbackAddressInputProps> = ({
  value,
  onChange,
  placeholder = "Enter address",
  className = "",
  required = false
}) => {
  const [showLocationError, setShowLocationError] = useState(false);
  const [locationMethod, setLocationMethod] = useState<string>('');

  const handleLocationClick = async (useNetwork = false) => {
    try {
      const location = useNetwork 
        ? await networkLocationService.getNetworkLocation()
        : await networkLocationService.getGPSLocation();
        
      const connectionInfo = networkLocationService.getConnectionInfo();
      setLocationMethod(useNetwork ? 'Network' : connectionInfo.type === 'wifi' ? 'WiFi' : 'GPS');
      
      onChange(`Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`);
    } catch (error) {
      setShowLocationError(true);
      setTimeout(() => setShowLocationError(false), 3000);
    }
  };

  return (
    <div>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all bg-white/80 backdrop-blur ${className}`}
        />
      </div>
      
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => handleLocationClick(false)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Navigation className="w-4 h-4" />
          GPS Location
        </button>
        
        <button
          type="button"
          onClick={() => handleLocationClick(true)}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          title="Use WiFi/Mobile Network"
        >
          <Wifi className="w-4 h-4" />
        </button>
      </div>
      
      {locationMethod && (
        <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
          {locationMethod === 'WiFi' && <Wifi className="w-4 h-4" />}
          {locationMethod === 'Network' && <Smartphone className="w-4 h-4" />}
          {locationMethod === 'GPS' && <Navigation className="w-4 h-4" />}
          <span>Located via {locationMethod}</span>
        </div>
      )}
      
      {showLocationError && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          Location access denied or not available
        </div>
      )}
    </div>
  );
};