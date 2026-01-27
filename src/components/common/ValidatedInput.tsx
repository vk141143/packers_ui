import React from 'react';
import { sanitizePhone, sanitizeNumeric, sanitizeAlpha } from '../../utils/validation';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validationType?: 'phone' | 'numeric' | 'alpha' | 'alphanumeric' | 'email' | 'text';
  error?: string;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  validationType = 'text',
  error,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    switch (validationType) {
      case 'phone':
      case 'numeric':
        value = sanitizeNumeric(value);
        break;
      case 'alpha':
        value = sanitizeAlpha(value);
        break;
      case 'email':
        value = value.toLowerCase().trim();
        break;
    }

    e.target.value = value;
    onChange?.(e);
  };

  return (
    <div className="w-full">
      <input
        {...props}
        onChange={handleChange}
        className={`${props.className} ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
