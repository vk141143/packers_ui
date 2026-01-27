import React, { useState } from 'react';
import { Sidebar, NavItem } from './Sidebar';
import { Header } from './Header';
import { VoiceAssistant } from '../common/VoiceAssistant';
import { User } from '../../types';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
  user: User;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  navItems,
  title,
  user,
  onLogout,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar navItems={navItems} title={title} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden">
        {/* Hamburger Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-30 lg:hidden bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <VoiceAssistant userRole={user.role} />
    </div>
  );
};
