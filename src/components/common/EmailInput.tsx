import React from 'react';
import { Mail } from 'lucide-react';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  placeholder = "Email address",
  required = false,
  className = ""
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value.toLowerCase().trim();
    onChange(email);
  };

  const isValid = value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  return (
    <div className={`relative ${className}`}>
      <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="email"
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={handleChange}
        className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:outline-none transition-all ${
          isValid 
            ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-200' 
            : 'border-red-300 focus:border-red-500 focus:ring-red-200'
        }`}
      />
      {!isValid && value && (
        <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
      )}
    </div>
  );
};