import React, { useState } from 'react';
import { MapPin, Clock, CheckCircle, Truck, Phone } from 'lucide-react';
import { Job } from '../../types';
import { JobMap } from './JobMap';

interface LiveTrackingProps {
  job: Job;
  className?: string;
}

export const LiveTracking: React.FC<LiveTrackingProps> = ({ job, className = '' }) => {
  const [showMap, setShowMap] = useState(false);
  const [estimatedArrival] = useState<string>('15:30');
  const [distance] = useState<number>(5.2);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'crew-dispatched': return 'bg-blue-100 text-blue-700';
      case 'crew-arrived': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'crew-dispatched': return 'Crew En Route';
      case 'crew-arrived': return 'Crew Arrived';
      case 'in-progress': return 'Work in Progress';
      case 'completed': return 'Completed';
      default: return 'Scheduled';
    }
  };

  return (
    <>
      <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
        <div className="bg-blue-600 p-4 text-white rounded-t-xl">
          <h3 className="text-lg font-bold">Live Tracking</h3>
          <p className="text-sm text-blue-100">Job {job.id}</p>
        </div>

        <div className="p-4 space-y-4">
          {/* Status */}
          <div className={`px-4 py-2 rounded-lg text-center font-bold ${getStatusColor(job.status)}`}>
            {getStatusText(job.status)}
          </div>

          {/* Crew */}
          {job.crewAssigned && job.crewAssigned.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">Assigned Crew</p>
              <p className="font-bold text-gray-900">{job.crewAssigned.join(', ')}</p>
            </div>
          )}

          {/* Distance & ETA */}
          {(job.status === 'crew-dispatched' || job.status === 'crew-arrived') && (
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Distance</span>
                <span className="font-bold">{distance} km</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">ETA</span>
                <span className="font-bold">{estimatedArrival}</span>
              </div>
            </div>
          )}

          {/* Progress */}
          <div>
            <p className="text-xs text-gray-600 mb-2 font-semibold">Progress</p>
            <div className="space-y-2">
              {[
                { key: 'crew-dispatched', label: 'Dispatched' },
                { key: 'crew-arrived', label: 'Arrived' },
                { key: 'in-progress', label: 'In Progress' },
                { key: 'completed', label: 'Completed' },
              ].map((step, index) => {
                const isCompleted = job.statusHistory?.some(h => h.status === step.key);
                const isCurrent = job.status === step.key;
                
                return (
                  <div key={step.key} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted ? 'bg-green-500 text-white' : 
                      isCurrent ? 'bg-blue-500 text-white' : 
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className={`text-sm ${
                      isCompleted || isCurrent ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Button */}
          <button
            onClick={() => setShowMap(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            View Map
          </button>
        </div>
      </div>

      {showMap && <JobMap job={job} onClose={() => setShowMap(false)} />}
    </>
  );
};