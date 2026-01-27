import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/badge.tsx';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/Separator';
import { HelpSupport } from './HelpSupport';
import {
  ChevronRight,
  Settings,
  User,
  Bell,
  Shield,
  Star,
  Award,
  TrendingUp,
  Target,
  DollarSign,
  Phone,
  Mail,
  LogOut,
  HelpCircle,
  Users
} from 'lucide-react';

export const ModernSalesProfile: React.FC = () => {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  if (showHelp) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-green-600 p-4">
          <button 
            onClick={() => setShowHelp(false)}
            className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to Profile
          </button>
        </div>
        <HelpSupport userRole="sales" />
      </div>
    );
  }
  const userStats = [
    { label: "Deals", value: "34", icon: Target },
    { label: "Revenue", value: "£180K", icon: DollarSign },
    { label: "Conversion", value: "68%", icon: TrendingUp },
  ];

  const menuItems = [
    {
      section: "Sales",
      items: [
        { icon: User, label: "Edit Profile", description: "Personal information" },
        { icon: Target, label: "Sales Targets", description: "Goals & quotas", badge: "85%" },
        { icon: Users, label: "Client Management", description: "Customer relationships" },
      ],
    },
    {
      section: "Performance",
      items: [
        { icon: TrendingUp, label: "Sales Pipeline", description: "Active opportunities" },
        { icon: DollarSign, label: "Revenue Reports", description: "Earnings & commissions" },
        { icon: Star, label: "Performance Metrics", description: "KPIs & achievements" },
      ],
    },
    {
      section: "Tools",
      items: [
        { icon: Bell, label: "Notifications", description: "Sales alerts" },
        { icon: HelpCircle, label: "Help & Support", description: "Sales resources" },
        { icon: Shield, label: "Account Security", description: "Privacy settings" },
        { icon: Settings, label: "Preferences", description: "App settings" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 pt-8 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-2xl font-bold">Sales Profile</h1>
            <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <Settings className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="size-20 border-4 border-white shadow-lg">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback className="text-xl bg-white text-green-600">TR</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold">Tom Richards</h2>
              <p className="text-white/90 text-sm flex items-center gap-1">
                <Phone className="size-3" />
                +44 7700 900321
              </p>
              <p className="text-white/90 text-sm flex items-center gap-1">
                <Mail className="size-3" />
                tom@moveaway.co.uk
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-3 gap-3 mb-6">
          {userStats.map((stat, index) => (
            <Card key={index} className="bg-white border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <stat.icon className="size-5 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Award className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Top Performer</h3>
                  <p className="text-white/90 text-sm">Q4 Sales Leader</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-white" />
            </div>
          </CardContent>
        </Card>

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
                      } else if (item.label === 'Sales Pipeline') {
                        navigate('/sales');
                      } else if (item.label === 'Client Management') {
                        navigate('/sales/clients');
                      } else if (item.label === 'Revenue Reports') {
                        navigate('/sales/reports');
                      } else {
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
                                <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-green-100 text-green-700">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{item.description}</p>
                          </div>
                          <ChevronRight className="size-5 text-gray-400 flex-shrink-0" />
                        </button>
                        {itemIndex < section.items.length - 1 && <Separator className="mx-4" />}
                      </React.Fragment>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ))}

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

        <div className="text-center pb-8">
          <p className="text-xs text-gray-500">Sales Portal v2.1.0</p>
        </div>
      </div>
    </div>
  );
};