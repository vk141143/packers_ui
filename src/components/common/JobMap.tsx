import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { Job } from '../../types';

interface JobMapProps {
  job: Job;
  onClose: () => void;
  showRoute?: boolean;
  crewLocation?: [number, number];
}

export const JobMap: React.FC<JobMapProps> = ({ job, onClose }) => {

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[700px] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Job Location - {job.id}</h3>
              <p className="text-sm text-gray-600">{job.pickupAddress}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        
        {/* Route Info */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <p className="text-sm text-gray-600">Map view disabled - API integrations removed</p>
        </div>
        
        <div className="flex-1 relative">
          <div className="w-full h-full rounded-b-2xl bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Map view disabled</p>
          </div>
        </div>
      </div>
    </div>
  );
};
