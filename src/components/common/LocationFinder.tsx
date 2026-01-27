import React, { useState } from 'react';
import { Loader2, Navigation } from 'lucide-react';

interface LocationFinderProps {
  onLocationFound: (address: string, coordinates: [number, number]) => void;
  className?: string;
}

export const LocationFinder: React.FC<LocationFinderProps> = ({ onLocationFound, className = '' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findMyLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
          const address = `${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`;
          onLocationFound(address, coords);
          setLoading(false);
        },
        () => {
          setError('Unable to find your location. Please check location permissions.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={findMyLocation}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Navigation className="w-4 h-4" />
        )}
        {loading ? 'Finding...' : 'Find My Location'}
      </button>
      
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};