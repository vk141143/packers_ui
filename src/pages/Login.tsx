import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Truck, Mail, Lock, UserCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { loginCrew, loginAdmin, loginClient, loginSales, loginManagement } from '../services/authService';
import { confirmJob } from '../services/api';
import { loadBookingData } from '../utils/bookingPersistence';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const hasBooking = searchParams.get('booking') === 'true';
  const [formData, setFormData] = useState({ email: '', password: '', role: 'client' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({ email: '', password: '' });
    
    // Validate fields
    const newErrors = { email: '', password: '' };
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }
    
    try {
      // Call appropriate login function based on role
      if (formData.role === 'client') {
        await loginClient(formData.email, formData.password);
      } else if (formData.role === 'admin') {
        await loginAdmin(formData.email, formData.password);
      } else if (formData.role === 'crew') {
        await loginCrew(formData.email, formData.password);
      } else if (formData.role === 'sales') {
        await loginSales(formData.email, formData.password);
      } else if (formData.role === 'management') {
        await loginManagement(formData.email, formData.password);
      }
      
      // Update AuthContext with the new user data
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
      
      // Navigate to appropriate dashboard
      if (hasBooking && formData.role === 'client') {
        navigate('/client/book');
      } else {
        navigate(`/${formData.role}`);
      }
      
    } catch (err: any) {
      alert('Login failed: ' + (err?.message || 'Invalid credentials'));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
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
          <p className="text-blue-100 text-lg mb-12 max-w-md mx-auto">Professional property clearance services for councils, landlords, and insurers across the UK</p>
          
          <div className="space-y-4 max-w-md mx-auto">
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
        
        <p className="text-blue-200 text-sm relative z-10 text-center">Trusted by councils and organizations nationwide</p>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm focus:ring-2 focus:outline-none transition-all ${
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`w-full pl-11 pr-12 py-3 border rounded-lg text-sm focus:ring-2 focus:outline-none transition-all ${
                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                }`}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="relative">
              <UserCircle size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all appearance-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {hasBooking ? (
                  // Only show client/customer for booking flow
                  <>
                    <option value="client">Client (Council/Landlord/Insurer)</option>
                  </>
                ) : (
                  // Show all roles for regular login
                  <>
                    <option value="client">Client (Council/Landlord/Insurer)</option>
                    <option value="admin">Operations Admin</option>
                    <option value="crew">Field Crew</option>
                    <option value="sales">Sales Team</option>
                    <option value="management">Management</option>
                  </>
                )}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};
