import React, { useState } from 'react';

export const ResetPassword: React.FC = () => {
  const [otpMethod, setOtpMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSendOTP = () => {
    console.log('Sending OTP via:', otpMethod, otpMethod === 'email' ? email : phone);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
      <p className="text-gray-600 mb-6">Choose how to receive your OTP</p>
      
      <div className="space-y-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="otpMethod"
            value="email"
            checked={otpMethod === 'email'}
            onChange={() => setOtpMethod('email')}
            className="w-4 h-4 text-blue-600"
          />
          <span className="font-medium">Email</span>
        </label>
        
        {otpMethod === 'email' && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        )}

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="otpMethod"
            value="phone"
            checked={otpMethod === 'phone'}
            onChange={() => setOtpMethod('phone')}
            className="w-4 h-4 text-blue-600"
          />
          <span className="font-medium">Phone Number</span>
        </label>
        
        {otpMethod === 'phone' && (
          <div className="flex border rounded-md">
            <select className="px-3 py-2 bg-gray-50 border-r text-sm">
              <option>🇬🇧 +44</option>
              <option>🇺🇸 +1</option>
              <option>🇫🇷 +33</option>
              <option>🇩🇪 +49</option>
              <option>🇮🇳 +91</option>
            </select>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="flex-1 px-3 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-md"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleSendOTP}
        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Send OTP
      </button>
    </div>
  );
};