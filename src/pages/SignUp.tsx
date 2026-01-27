import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Truck, Mail, Lock, User, UserCircle, Building, MapPin, CheckCircle, Eye, EyeOff, Phone, Briefcase } from 'lucide-react';
import { PhoneInput } from '../components/common/PhoneInput';
import { userStore } from '../store/userStore';
import { registerCrew, registerClient, verifyOtp, resendOtp } from '../services/authService';
import { confirmJob } from '../services/api';
import { loadBookingData, clearBookingData } from '../utils/bookingPersistence';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasBooking = searchParams.get('booking') === 'true';
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpMethod, setOtpMethod] = useState<'email' | 'phone'>('email');
  const [pendingBooking, setPendingBooking] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    fullName: '', 
    password: '', 
    role: '',
    companyName: '',
    phone: '',
    countryCode: '+44',
    address: '',
    clientType: 'council',
    contactPerson: '',
    department: '',
    driversLicense: null as File | null,
    dbsCertificate: null as File | null,
    proofOfAddress: null as File | null,
    insurance: null as File | null,
    rightToWork: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);

  const handlePhoneChange = (value: string) => {
    const numbersOnly = value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, phone: numbersOnly });
  };

  const countryCodes = [
    { code: '+44', country: 'UK' },
    { code: '+1', country: 'US/CA' },
    { code: '+91', country: 'IN' },
    { code: '+61', country: 'AU' },
    { code: '+33', country: 'FR' },
    { code: '+49', country: 'DE' },
    { code: '+86', country: 'CN' },
    { code: '+81', country: 'JP' },
  ];

  useEffect(() => {
    if (hasBooking) {
      // Load booking data using utility function
      const bookingData = loadBookingData();
      if (bookingData) {
        setPendingBooking(bookingData);
        setFormData(prev => ({ ...prev, role: 'client' }));
        setStep(2);
      }
    }
  }, [hasBooking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!formData.email.trim()) {
      alert('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Validate full name
    if (!formData.fullName.trim()) {
      alert('Full name is required');
      return;
    }
    if (formData.fullName.trim().length < 2) {
      alert('Full name must be at least 2 characters');
      return;
    }
    
    // Validate password
    if (!formData.password.trim()) {
      alert('Password is required');
      return;
    }
    if (formData.password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      alert('Password must contain uppercase, lowercase, and number');
      return;
    }
    
    // Check required fields based on role
    const requiredFields = ['email', 'fullName', 'password'];
    
    if (formData.role === 'client') {
      requiredFields.push('companyName', 'phone', 'address');
      
      if (!formData.companyName.trim()) {
        alert('Company/Organization name is required');
        return;
      }
      if (!formData.phone.trim()) {
        alert('Phone number is required');
        return;
      }
      if (formData.phone.length < 10) {
        alert('Phone number must be at least 10 digits');
        return;
      }
      if (!formData.address.trim()) {
        alert('Address is required');
        return;
      }
    }
    
    if (formData.role === 'crew') {
      requiredFields.push('phone');
      
      if (!formData.phone.trim()) {
        alert('Phone number is required');
        return;
      }
      if (formData.phone.length < 10) {
        alert('Phone number must be at least 10 digits');
        return;
      }
      if (!formData.driversLicense || !formData.dbsCertificate || !formData.proofOfAddress || !formData.insurance || !formData.rightToWork) {
        alert('Please upload all required documents.');
        return;
      }
    }
    
    if (formData.role === 'sales') {
      requiredFields.push('phone', 'address');
      
      if (!formData.phone.trim()) {
        alert('Phone number is required');
        return;
      }
      if (formData.phone.length < 10) {
        alert('Phone number must be at least 10 digits');
        return;
      }
      if (!formData.address.trim()) {
        alert('Address is required');
        return;
      }
    }
    
    if (formData.role === 'client') {
      // Call API to send OTP
      try {
        await registerClient({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          company_name: formData.companyName,
          contact_person_name: formData.contactPerson,
          department: formData.department || '',
          phone_number: `${formData.countryCode}${formData.phone}`,
          client_type: formData.clientType,
          business_address: formData.address,
          otp_method: otpMethod,
        });
        const destination = otpMethod === 'email' ? formData.email : formData.phone;
        alert(`✅ Registration Successful!\n\nOTP has been sent to your ${otpMethod}:\n${destination}\n\nPlease check and enter the 4-digit code to verify your account.`);
        setStep(4);
      } catch (err: any) {
        console.error('Registration error:', err);
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          alert('❌ Server Connection Error\n\nThe registration server is currently unavailable. Please try again later or contact support.');
        } else {
          alert('❌ Registration Failed\n\n' + (err?.message || 'Unknown error'));
        }
      }
    } else if (formData.role === 'crew' || formData.role === 'sales' || formData.role === 'management') {
      if (formData.role === 'crew') {
        try {
          setSubmitting(true);
          const resp = await registerCrew({
            email: formData.email,
            fullName: formData.fullName,
            password: formData.password,
            phone: formData.phone,
            countryCode: formData.countryCode,
            address: formData.address,
            driversLicense: formData.driversLicense,
            dbsCertificate: formData.dbsCertificate,
            proofOfAddress: formData.proofOfAddress,
            insurance: formData.insurance,
            rightToWork: formData.rightToWork,
          });
          alert('✅ Crew Registration Submitted!\n\n🚛 Welcome to the Field Team!\n\n📋 Your application includes:\n• All required documents uploaded\n• Background verification pending\n• Skills assessment complete\n• Equipment training scheduled\n\n🔄 Status: Under review\n📧 You\'ll receive approval notification within 24-48 hours\n⏱️ Background checks typically take 2-3 business days');
          navigate('/login');
        } catch (err: any) {
          console.error('Crew registration failed', err);
          alert('Crew registration failed: ' + (err?.message || 'Unknown error'));
        } finally {
          setSubmitting(false);
        }
        } else {
        // Add to pending users store for non-crew roles
        userStore.addPendingUser({
          name: formData.fullName,
          email: formData.email,
          role: formData.role,
          phone: formData.phone,
          address: formData.address,
          companyName: formData.companyName,
          clientType: formData.clientType,
          documents: formData.role === 'crew' ? ['DBS Certificate', 'Driving License', 'Proof of Address', 'Right to Work', 'Insurance'] : undefined,
          department: formData.role === 'sales' ? 'Sales' : formData.role === 'management' ? 'Operations' : undefined,
          experience: formData.role === 'sales' ? 'Property sales experience' : formData.role === 'management' ? 'Property management experience' : undefined,
        });
        
        // Role-specific confirmation messages
        let confirmationMessage = '';
        if (formData.role === 'sales') {
          confirmationMessage = `✅ Sales Team Registration Submitted!\n\n🎯 Welcome to the Sales Team!\n\n📋 Your application includes:\n• Lead management access\n• Client communication tools\n• Quote generation system\n• Performance tracking\n\n🔄 Status: Pending admin approval\n📧 You'll receive login credentials once approved\n⏱️ Processing time: 1-2 business days`;
        } else if (formData.role === 'management') {
          confirmationMessage = `✅ Management Registration Submitted!\n\n👔 Welcome to the Management Team!\n\n📊 Your application includes:\n• Team performance analytics\n• Strategic planning tools\n• Resource management\n• Business intelligence dashboard\n\n🔄 Status: Pending admin approval\n📧 You'll receive login credentials once approved\n⏱️ Processing time: 1-2 business days`;
        } else {
          confirmationMessage = `✅ Registration submitted successfully!\n\n🔄 Your ${formData.role} account is pending admin approval.\n\n📧 You will receive an email confirmation once your application has been reviewed and approved by our admin team.\n\n⏱️ This process typically takes 1-2 business days.`;
        }
        
        alert(confirmationMessage);
        navigate('/login');
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 4) {
      alert('Please enter the complete 4-digit OTP');
      return;
    }
    
    try {
      setSubmitting(true);
      await verifyOtp(formData.email, enteredOtp);

      // If there is a pending booking draft (guest flow), attempt to confirm it now
      if (pendingBooking) {
        try {
          const draftId = pendingBooking?.jobDraft?.id || pendingBooking?.jobDraft?.job_id || pendingBooking?.jobDraft?.jobId || pendingBooking?.job_id;
          if (draftId) {
            const confirmResp = await confirmJob(draftId);
            if (!confirmResp.success) console.warn('Failed to confirm draft job after signup verification:', confirmResp.error);
          }
        } catch (confirmErr) {
          console.error('Error confirming draft after signup verification:', confirmErr);
        }

        alert(`Account verified successfully!\n\nYour booking has been submitted:\n- Service: ${pendingBooking.serviceType}\n- Address: ${pendingBooking.propertyAddress || pendingBooking.pickupAddress}\n- Date: ${pendingBooking.scheduledDate}\n\nRedirecting to your dashboard...`);
        // Clear all booking data using utility function
        clearBookingData();
        navigate('/client/book');
      } else {
        alert('Account verified successfully!');
        navigate('/login');
      }
    } catch (err: any) {
      console.error('Full error:', err);
      alert('Invalid OTP: ' + (err?.message || 'Please try again'));
      setOtp(['', '', '', '']);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-12 flex-col justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Truck size={28} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">Property Clearance Platform</h1>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Enterprise Platform</h2>
          <p className="text-blue-100 text-lg mb-8">Professional property clearance services for councils, landlords, and insurers across the UK</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
              <span>24/7 Emergency Response</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
              <span>SLA Guaranteed Services</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} />
              </div>
              <span>Full Documentation & Proof</span>
            </div>
          </div>
        </div>
        
        <p className="text-blue-200 text-sm relative z-10">Trusted by councils and organizations nationwide</p>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {pendingBooking && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-800 mb-1">📦 Booking Details</p>
                <p className="text-xs text-blue-700">{pendingBooking.serviceType} - {pendingBooking.propertyAddress}</p>
              </div>
            )}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600 mb-6">{hasBooking ? 'Complete signup to confirm your booking' : 'Start your journey with us today'}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Role Selection */}
            {step === 1 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Role</h3>
                <div className="space-y-3">
                  {[
                    { value: 'client', label: 'Client', desc: 'Council/Landlord/Insurer' },
                    { value: 'crew', label: 'Field Crew', desc: 'Execute jobs' },
                    { value: 'sales', label: 'Sales Team', desc: 'Manage leads' },
                    { value: 'management', label: 'Management', desc: 'View analytics' },
                  ].map((role) => (
                    <div
                      key={role.value}
                      onClick={() => {
                        setFormData({ ...formData, role: role.value });
                        setStep(2);
                      }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 ${
                        formData.role === role.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <p className="font-semibold text-gray-900">{role.label}</p>
                      <p className="text-sm text-gray-600">{role.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Step 2: Basic Info */}
            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-blue-600 hover:underline mb-4"
                >
                  ← Change Role
                </button>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
            >
              Next
            </button>
              </>
            )}

            {/* Step 3: Role-Specific Fields */}
            {step === 3 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-sm text-blue-600 hover:underline mb-4"
                >
                  ← Back
                </button>

            {/* Crew-specific documents */}
            {formData.role === 'crew' && (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">Required Documents for Crew</p>
                  <p className="text-xs text-yellow-700">Please upload the following documents</p>
                </div>

                <div className="flex gap-2">
                  <div className="relative w-28">
                    <Phone size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      className="w-full pl-8 pr-2 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all appearance-none"
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    >
                      {countryCodes.map(c => (
                        <option key={c.code} value={c.code}>{c.code} {c.country}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="tel"
                    placeholder="7123456789"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    maxLength={15}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Driver's License *</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    required
                    onChange={(e) => setFormData({ ...formData, driversLicense: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DBS Certificate (Background Check) *</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    required
                    onChange={(e) => setFormData({ ...formData, dbsCertificate: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Address *</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    required
                    onChange={(e) => setFormData({ ...formData, proofOfAddress: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Certificate *</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    required
                    onChange={(e) => setFormData({ ...formData, insurance: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Right to Work Document *</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    required
                    onChange={(e) => setFormData({ ...formData, rightToWork: e.target.files?.[0] || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </>
            )}

            {/* Client-specific fields */}
            {formData.role === 'client' && (
              <>
                <div className="relative">
                  <Building size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Company/Organization Name"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative w-28">
                    <Phone size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      className="w-full pl-8 pr-2 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all appearance-none"
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    >
                      {countryCodes.map(c => (
                        <option key={c.code} value={c.code}>{c.code} {c.country}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="tel"
                    placeholder="7123456789"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    maxLength={15}
                  />
                </div>
                <div className="relative">
                  <UserCircle size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all appearance-none cursor-pointer"
                    value={formData.clientType}
                    onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                  >
                    <option value="council">Council</option>
                    <option value="housing-association">Housing Association</option>
                    <option value="landlord">Landlord</option>
                    <option value="insurer">Insurance Company</option>
                  </select>
                </div>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Contact Person Name"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    value={formData.contactPerson || ''}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <Briefcase size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Department (e.g., Property Services)"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Sales/Management fields */}
            {(formData.role === 'sales' || formData.role === 'management') && (
              <>
                <div className="flex gap-2">
                  <div className="relative w-28">
                    <Phone size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      className="w-full pl-8 pr-2 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all appearance-none"
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    >
                      {countryCodes.map(c => (
                        <option key={c.code} value={c.code}>{c.code} {c.country}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="tel"
                    placeholder="7123456789"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    maxLength={15}
                  />
                </div>
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    placeholder="Address"
                    required
                    rows={2}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Common address field for client */}
            {formData.role === 'client' && (
              <div className="relative">
                <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  placeholder="Business Address"
                  required
                  rows={2}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : (formData.role === 'client' ? 'Continue' : 'Create Account')}
            </button>

            {formData.role === 'client' && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2 text-center">Send OTP via:</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setOtpMethod('email')}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                      otpMethod === 'email' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpMethod('phone')}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                      otpMethod === 'phone' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    <Phone size={16} className="inline mr-2" />
                    Phone
                  </button>
                </div>
              </div>
            )}
              </>
            )}

            {/* Step 4: OTP Verification (Client Only) */}
            {step === 4 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {otpMethod === 'email' ? <Mail size={32} className="text-blue-600" /> : <Phone size={32} className="text-blue-600" />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your {otpMethod === 'email' ? 'Email' : 'Phone'}</h3>
                  <p className="text-sm text-gray-600">Enter the 4-digit code sent to</p>
                  <p className="text-sm font-semibold text-gray-900">{otpMethod === 'email' ? formData.email : formData.phone}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(3);
                      setOtp(['', '', '', '']);
                    }}
                    className="text-xs text-blue-600 hover:underline mt-2"
                  >
                    Change verification method
                  </button>
                </div>

                <div className="flex gap-2 justify-center mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg mb-4"
                >
                  Verify & Create Account
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await resendOtp(formData.email);
                      alert(`OTP resent to ${otpMethod === 'email' ? formData.email : formData.phone}`);
                      setOtp(['', '', '', '']);
                    } catch (err: any) {
                      alert('Failed to resend OTP: ' + (err?.message || 'Unknown error'));
                    }
                  }}
                  className="w-full text-blue-600 text-sm hover:underline"
                >
                  Resend OTP
                </button>
              </>
            )}
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};
