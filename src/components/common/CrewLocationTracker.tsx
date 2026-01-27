import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { GeoLocation } from '../../types';

interface CrewLocationTrackerProps {
  jobId: string;
  onLocationUpdate?: (location: GeoLocation) => void;
  className?: string;
}

export const CrewLocationTracker: React.FC<CrewLocationTrackerProps> = ({
  jobId,
  onLocationUpdate,
  className = ''
}) => {
  const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    let watchId: number | null = null;

    const startTracking = () => {
      if (!navigator.geolocation) {
        setError('Geolocation not supported');
        return;
      }

      setIsTracking(true);
      setError(null);

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location: GeoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
          };

          setCurrentLocation(location);
          setLastUpdate(new Date().toLocaleTimeString('en-GB'));
          onLocationUpdate?.(location);
        },
        (error) => {
          setError(`Location error: ${error.message}`);
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000, // 30 seconds
        }
      );
    };

    const stopTracking = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      setIsTracking(false);
    };

    // Auto-start tracking
    startTracking();

    return () => {
      stopTracking();
    };
  }, [onLocationUpdate]);

  const handleManualUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: GeoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
          };
          setCurrentLocation(location);
          setLastUpdate(new Date().toLocaleTimeString('en-GB'));
          onLocationUpdate?.(location);
        },
        () => setError('Failed to get current location')
      );
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isTracking ? 'bg-green-500' : 'bg-gray-400'
          }`}>
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Location Tracking</h3>
            <p className="text-sm text-gray-600">Job {jobId}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isTracking 
            ? 'text-green-600 bg-green-50' 
            : 'text-gray-600 bg-gray-50'
        }`}>
          {isTracking ? 'Active' : 'Inactive'}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">Location Error</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {currentLocation && (
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-gray-900">Current Location</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Latitude</p>
                <p className="font-mono text-gray-900">{currentLocation.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-gray-600">Longitude</p>
                <p className="font-mono text-gray-900">{currentLocation.longitude.toFixed(6)}</p>
              </div>
            </div>
          </div>

          {lastUpdate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdate}</span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleManualUpdate}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
        >
          <MapPin className="w-5 h-5" />
          Update Location
        </button>

        <div className="text-xs text-gray-500 text-center">
          Location is automatically tracked and updated every 30 seconds
        </div>
      </div>
    </div>
  );
};