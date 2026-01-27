import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building, Edit2, Save, X, Shield, Calendar, Briefcase, Award, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminProfile, updateAdminProfile } from '../../services/authService';

export const AdminProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    address: '',
    clientType: 'admin',
    contactPerson: '',
    department: '',
    joinDate: '',
    accountManager: ''
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getAdminProfile();
      setProfile({
        name: data.full_name || '',
        email: data.email || '',
        phone: data.phone_number || '',
        companyName: data.organization_name || 'MoveAway Ltd',
        address: data.business_address || '',
        clientType: 'admin',
        contactPerson: data.contact_person || data.full_name || '',
        department: data.department || 'Operations',
        joinDate: data.created_at || '2023-01-01',
        accountManager: 'System Admin'
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateAdminProfile({
        full_name: profile.name,
        phone_number: profile.phone,
        organization_name: profile.companyName,
        business_address: profile.address,
        department: profile.department,
        contact_person: profile.contactPerson
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
          transition={{ duration: 8, repeat: Infinity }} 
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} 
          transition={{ duration: 10, repeat: Infinity }} 
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl" 
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-6 right-6 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
            >
              <CheckCircle size={24} />
              <span className="font-semibold">Profile updated successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl p-8 mb-8 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                👤 My Profile
              </h1>
              <p className="text-lg text-gray-600">Manage your account information and preferences</p>
            </div>
            {!isEditing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                <Edit2 size={18} />
                Edit Profile
              </motion.button>
            ) : (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold shadow-lg"
                >
                  <Save size={18} />
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-semibold"
                >
                  <X size={18} />
                  Cancel
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl p-6 shadow-xl text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Building size={64} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.companyName}</h3>
              <p className="text-sm text-gray-600 mb-4 capitalize">{profile.clientType} User</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>Member since {new Date(profile.joinDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl p-6 shadow-xl">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award size={20} className="text-blue-600" />
                Account Status
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <span className="text-sm text-gray-700">Verification</span>
                  <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                    <CheckCircle size={14} />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm text-gray-700">Account Type</span>
                  <span className="text-xs font-bold text-blue-700 uppercase">{profile.clientType}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <span className="text-sm text-gray-700">Status</span>
                  <span className="text-xs font-bold text-purple-700">Active</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase size={24} className="text-blue-600" />
                Organization Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Building size={16} className="text-blue-600" />
                    Organization Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.companyName}
                      onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-xl">{profile.companyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Mail size={16} className="text-blue-600" />
                    Email Address
                  </label>
                  <div className="relative">
                    <p className="text-gray-500 px-4 py-3 bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center gap-2">
                      {profile.email}
                      <Shield size={14} className="text-gray-400" />
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Phone size={16} className="text-blue-600" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-xl">{profile.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User size={16} className="text-blue-600" />
                    Contact Person
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.contactPerson}
                      onChange={(e) => setProfile({...profile, contactPerson: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-xl">{profile.contactPerson}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Briefcase size={16} className="text-blue-600" />
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({...profile, department: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-xl">{profile.department}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User size={16} className="text-blue-600" />
                    Account Manager
                  </label>
                  <p className="text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-xl">{profile.accountManager}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin size={16} className="text-blue-600" />
                  Business Address
                </label>
                {isEditing ? (
                  <textarea
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                ) : (
                  <p className="text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-xl">{profile.address}</p>
                )}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Account Security</h4>
                    <p className="text-sm text-blue-700">
                      🔒 Your email address is locked for security purposes. If you need to update your primary email, please contact our support team.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};