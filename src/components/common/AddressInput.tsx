import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';

interface AddressInputProps {
  value: string;
  onChange: (address: string, coordinates?: [number, number]) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  showLocationFinder?: boolean;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  placeholder = "Enter address",
  className = "",
  required = false,
  showLocationFinder = true
}) => {
  const [showSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const clearInput = () => {
    onChange('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className={`w-full pl-10 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all bg-white/80 backdrop-blur ${className}`}
        />
        {value && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};