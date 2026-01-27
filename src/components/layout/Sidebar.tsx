import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon, X } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navItems: NavItem[];
  title: string;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ navItems, title, onClose }) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-900 text-white h-full overflow-y-auto p-4 shadow-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
