import React from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const countryCodes = [
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
];

export const PhoneInput: React.FC<PhoneInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Enter phone number" 
}) => {
  const [selectedCode, setSelectedCode] = React.useState('+44');
  const [phoneNumber, setPhoneNumber] = React.useState('');

  React.useEffect(() => {
    onChange(`${selectedCode} ${phoneNumber}`);
  }, [selectedCode, phoneNumber, onChange]);

  return (
    <div className="flex border rounded-md focus-within:ring-2 focus-within:ring-blue-500">
      <select 
        value={selectedCode}
        onChange={(e) => setSelectedCode(e.target.value)}
        className="px-3 py-2 bg-gray-50 border-r text-sm font-medium min-w-[80px] rounded-l-md"
      >
        {countryCodes.map(({ code, country, flag }) => (
          <option key={code} value={code}>
            {flag} {code}
          </option>
        ))}
      </select>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 border-0 rounded-r-md focus:outline-none"
      />
    </div>
  );
};