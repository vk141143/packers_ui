import React, { useState } from 'react';
import { ModernManagementProfile } from '../../components/common/ModernManagementProfile';
import { User, Mail, Phone, MapPin, TrendingUp, Edit2, Save, X } from 'lucide-react';

export const ManagementProfile: React.FC = () => {
  const [showModern, setShowModern] = useState(true);
  if (showModern) {
    return <ModernManagementProfile />;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Emma Wilson',
    email: 'emma@moveaway.co.uk',
    phone: '+44 7700 900789',
    role: 'General Manager',
    department: 'Management',
    location: 'London HQ',
    joinDate: '2021-01-10',
    responsibilities: ['Strategic Planning', 'Team Management', 'Performance Analysis', 'Business Development']
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Management Profile</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit2 size={16} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-gray-900">{profile.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp size={16} className="inline mr-2" />
                Role
              </label>
              <p className="text-gray-900">{profile.role}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <p className="text-gray-900">{profile.department}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Location
              </label>
              <p className="text-gray-900">{profile.location}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Key Responsibilities</label>
          <div className="flex flex-wrap gap-2">
            {profile.responsibilities.map((responsibility) => (
              <span key={responsibility} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {responsibility}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};