import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import { Separator } from '../ui/Separator';
import { CrewEarnings } from './CrewEarnings';
import { HelpSupport } from './HelpSupport';
import {
  ChevronRight,
  MapPin,
  Settings,
  User,
  Bell,
  CreditCard,
  Shield,
  Star,
  Award,
  Package,
  Clock,
  Truck,
  FileText,
  Phone,
  Mail,
  LogOut,
  HelpCircle
} from 'lucide-react';

export const ModernProfile: React.FC = () => {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  if (showHelp) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-600 p-4">
          <button 
            onClick={() => setShowHelp(false)}
            className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to Profile
          </button>
        </div>
        <HelpSupport userRole="crew" />
      </div>
    );
  }
  const userStats = [
    { label: "Jobs", value: "47", icon: Package },
    { label: "Rating", value: "4.8", icon: Star },
    { label: "Years", value: "3", icon: Award },
  ];

  const menuItems = [
    {
      section: "Account",
      items: [
        { icon: User, label: "Edit Profile", description: "Name, phone, email" },
        { icon: MapPin, label: "Manage Addresses", description: "Saved addresses", badge: "3" },
        { icon: CreditCard, label: "Payment Methods", description: "Cards, bank details" },
      ],
    },
    {
      section: "Jobs & Services",
      items: [
        { icon: Package, label: "Job History", description: "Track & view jobs" },
        { icon: Truck, label: "Active Jobs", description: "Current assignments", badge: "2" },
        { icon: FileText, label: "Reports", description: "Performance reports" },
      ],
    },
    {
      section: "More",
      items: [
        { icon: Bell, label: "Notifications", description: "Manage preferences" },
        { icon: HelpCircle, label: "Help & Support", description: "FAQs & contact us" },
        { icon: Shield, label: "Privacy & Security", description: "Account settings" },
        { icon: Settings, label: "App Settings", description: "Preferences" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      {/* Header with Profile Info */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 pt-8 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-2xl font-bold">Profile</h1>
            <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <Settings className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="size-20 border-4 border-white shadow-lg">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback className="text-xl bg-white text-blue-600">MD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold">Mike Davies</h2>
              <p className="text-white/90 text-sm flex items-center gap-1">
                <Phone className="size-3" />
                +44 7700 900123
              </p>
              <p className="text-white/90 text-sm flex items-center gap-1">
                <Mail className="size-3" />
                mike@moveaway.co.uk
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-16">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {userStats.map((stat, index) => (
            <Card key={index} className="bg-white border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <stat.icon className="size-5 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Crew Status Banner */}
        <Card className="mb-6 bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Award className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Senior Crew Member</h3>
                  <p className="text-white/90 text-sm">Emergency specialist</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-white" />
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <Truck className="size-32 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Earnings Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 px-1">
            Earnings
          </h3>
          <CrewEarnings />
        </div>

        {/* Menu Sections */}
        <div className="space-y-6 pb-8">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 px-1">
                {section.section}
              </h3>
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-0">
                  {section.items.map((item, itemIndex) => {
                    const handleClick = () => {
                      if (item.label === 'Help & Support') {
                        setShowHelp(true);
                      } else if (item.label === 'Job History') {
                        navigate('/crew/history');
                      } else if (item.label === 'Active Jobs') {
                        navigate('/crew');
                      } else if (item.label === 'Reports') {
                        navigate('/crew/reports');
                      } else {
                        // Default behavior for other items
                        console.log(`Clicked: ${item.label}`);
                      }
                    };
                    
                    return (
                      <React.Fragment key={itemIndex}>
                        <button 
                          onClick={handleClick}
                          className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="p-2 rounded-lg bg-gray-100">
                            <item.icon className="size-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{item.label}</p>
                              {item.badge && (
                                <Badge
                                  variant="secondary"
                                  className="h-5 px-1.5 text-xs bg-blue-100 text-blue-700"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {item.description}
                            </p>
                          </div>
                          <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
                        </button>
                        {itemIndex < section.items.length - 1 && (
                          <Separator className="mx-4" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Logout Button */}
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-0">
              <button className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors text-left">
                <div className="p-2 rounded-lg bg-red-100">
                  <LogOut className="size-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-500">Logout</p>
                  <p className="text-sm text-gray-600">Sign out of your account</p>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* App Version */}
        <div className="text-center pb-8">
          <p className="text-xs text-gray-500">Version 2.1.0</p>
          <p className="text-xs text-gray-500 mt-1">
            UK Packers & Movers Platform
          </p>
        </div>
      </div>
    </div>
  );
};