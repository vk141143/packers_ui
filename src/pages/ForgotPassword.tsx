import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Mail, Phone, ArrowLeft, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import { forgotPassword, verifyForgotOtp, resetPassword } from '../services/authService';

type Step = 'method' | 'otp' | 'reset';
type Method = 'email' | 'phone';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<Method>('email');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [timer, setTimer] = useState(75);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) setCanResend(true);
  }, [step, timer]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate contact
    if (!contact.trim()) {
      alert('Please enter your ' + (method === 'email' ? 'email' : 'phone number'));
      return;
    }
    
    if (method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (method === 'phone' && contact.replace(/[^0-9]/g, '').length < 10) {
      alert('Please enter a valid phone number (minimum 10 digits)');
      return;
    }
    
    try {
      await forgotPassword(contact);
      alert(`OTP sent to ${contact}`);
      setStep('otp');
      setTimer(75);
      setCanResend(false);
    } catch (err: any) {
      alert('Failed to send OTP: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      alert('Please enter complete 4-digit OTP');
      return;
    }
    
    try {
      const data = await verifyForgotOtp(contact, otpValue);
      const token = data.reset_token || data.message?.split('Reset token: ')[1];
      console.log('Extracted reset token:', token);
      setResetToken(token);
      setStep('reset');
    } catch (err: any) {
      alert('Invalid OTP: ' + (err?.message || 'Please try again'));
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      alert('Please enter a new password');
      return;
    }
    
    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      alert('Password must contain uppercase, lowercase, and number');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      await resetPassword(resetToken, password);
      alert('Password reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (err: any) {
      alert('Failed to reset password: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleResend = () => {
    console.log('Resending OTP');
    setTimer(75);
    setCanResend(false);
    setOtp(['', '', '', '']);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Truck size={48} className="text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4">Property Clearance</h1>
          <h2 className="text-3xl font-semibold text-blue-100 mb-8">Enterprise Platform</h2>
          <p className="text-blue-100 text-lg mb-12 max-w-md mx-auto">Secure password recovery for your account</p>
        </div>
        
        <p className="text-blue-200 text-sm relative z-10 text-center">Your security is our priority</p>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Link to="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6">
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </Link>

            {/* Step 1: Select Method */}
            {step === 'method' && (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600 mb-6">Choose how to receive your OTP</p>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
                      style={{ borderColor: method === 'email' ? '#2563eb' : '#e5e7eb' }}>
                      <input type="radio" name="method" value="email" checked={method === 'email'}
                        onChange={() => setMethod('email')} className="mr-3" />
                      <Mail size={20} className="mr-2 text-blue-600" />
                      <span className="font-medium">Email</span>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
                      style={{ borderColor: method === 'phone' ? '#2563eb' : '#e5e7eb' }}>
                      <input type="radio" name="method" value="phone" checked={method === 'phone'}
                        onChange={() => setMethod('phone')} className="mr-3" />
                      <Phone size={20} className="mr-2 text-blue-600" />
                      <span className="font-medium">Phone Number</span>
                    </label>
                  </div>

                  <div className="relative">
                    {method === 'email' ? (
                      <>
                        <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Enter your email"
                          required
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                        />
                      </>
                    ) : (
                      <div className="flex border border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                        <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                        <select className="pl-11 pr-3 py-3 bg-gray-50 border-r text-sm font-medium min-w-[100px] rounded-l-lg focus:outline-none">
                          <option>🇬🇧 +44</option>
                          <option>🇺🇸 +1</option>
                          <option>🇫🇷 +33</option>
                          <option>🇩🇪 +49</option>
                          <option>🇮🇳 +91</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          required
                          className="flex-1 px-3 py-3 border-0 rounded-r-lg focus:outline-none"
                          value={contact}
                          onChange={(e) => {
                            const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                            setContact(numbersOnly);
                          }}
                          maxLength={15}
                        />
                      </div>
                    )}
                  </div>

                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg">
                    Send OTP
                  </button>
                </form>
              </>
            )}

            {/* Step 2: Verify OTP */}
            {step === 'otp' && (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter OTP</h2>
                <p className="text-gray-600 mb-6">
                  We sent a 4-digit code to {method === 'email' ? contact : `***${contact.slice(-4)}`}
                </p>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && index > 0) {
                            document.getElementById(`otp-${index - 1}`)?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-center text-sm">
                    {!canResend ? (
                      <p className="text-gray-600">Resend OTP in {timer}s</p>
                    ) : (
                      <button type="button" onClick={handleResend} className="text-blue-600 font-semibold hover:underline">
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg">
                    Verify OTP
                  </button>
                </form>
              </>
            )}

            {/* Step 3: Reset Password */}
            {step === 'reset' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create New Password</h2>
                <p className="text-gray-600 mb-6 text-center">Enter your new password</p>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password (min 8 chars)"
                      required
                      minLength={8}
                      className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      required
                      className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-sm text-red-600">Passwords do not match</p>
                  )}
                  
                  {password && password.length > 0 && password.length < 8 && (
                    <p className="text-sm text-orange-600">Password must be at least 8 characters</p>
                  )}

                  <button type="submit" disabled={password !== confirmPassword || password.length < 8}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                    Reset Password
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
