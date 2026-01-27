import React, { useState, useEffect } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { User as UserType } from '../../types';
import { getClientProfile } from '../../services/authService';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [avatar, setAvatar] = useState<string>(`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=80&background=2563eb&color=fff`);

  useEffect(() => {
    const fetchAvatar = async () => {
      const token = localStorage.getItem('access_token');
      if (!token || token.startsWith('mock_token')) return;
      
      try {
        const profile = await getClientProfile();
        if (profile.profile_photo) {
          setAvatar(profile.profile_photo);
        }
      } catch (err) {
        // Silently handle errors - avatar will use default
      }
    };
    fetchAvatar();

    // Listen for profile photo updates
    const handlePhotoUpdate = (event: any) => {
      setAvatar(event.detail);
    };
    window.addEventListener('profilePhotoUpdated', handlePhotoUpdate);

    return () => {
      window.removeEventListener('profilePhotoUpdated', handlePhotoUpdate);
    };
  }, [user.name]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="ml-16">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 border-l pl-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
              <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Logout"
            >
              <LogOut size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
