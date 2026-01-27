import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/Card';
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
  BarChart3,
  Users,
  Phone,
  Mail,
  LogOut,
  HelpCircle
} from 'lucide-react';

export const ModernManagementProfile: React.FC = () => {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  if (showHelp) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-purple-600 p-4">
          <button 
            onClick={() => setShowHelp(false)}
            className="text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            ← Back to Profile
          </button>
        </div>
        <HelpSupport userRole="management" />
      </div>
    );
  }
  const userStats = [
    { label: "Teams", value: "8", icon: Users },
    { label: "Revenue", value: "£2.4M", icon: TrendingUp },
    { label: "Growth", value: "23%", icon: BarChart3 },
  ];

  const menuItems = [
    {
      section: "Management",
      items: [
        { icon: User, label: "Edit Profile", description: "Personal information" },
        { icon: Users, label: "Team Management", description: "Manage teams & roles" },
        { icon: BarChart3, label: "Analytics Dashboard", description: "Business insights", badge: "New" },
      ],
    },
    {
      section: "Business",
      items: [
        { icon: TrendingUp, label: "Performance Reports", description: "KPIs & metrics" },
        { icon: Award, label: "Company Goals", description: "Track objectives" },
        { icon: Star, label: "Quality Standards", description: "Service excellence" },
      ],
    },
    {
      section: "Settings",
      items: [
        { icon: Bell, label: "Notifications", description: "Executive alerts" },
        { icon: HelpCircle, label: "Help & Support", description: "Management resources" },
        { icon: Shield, label: "Security Settings", description: "Account protection" },
        { icon: Settings, label: "Preferences", description: "System settings" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 pt-8 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-2xl font-bold">Management Profile</h1>
            <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <Settings className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="size-20 border-4 border-white shadow-lg">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback className="text-xl bg-white text-purple-600">EW</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold">Emma Wilson</h2>
              <p className="text-white/90 text-sm flex items-center gap-1">
                <Phone className="size-3" />
                +44 7700 900789
              </p>
              <p className="text-white/90 text-sm flex items-center gap-1">
                <Mail className="size-3" />
                emma@moveaway.co.uk
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
                <stat.icon className="size-5 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6 bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Award className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Executive Level</h3>
                  <p className="text-white/90 text-sm">Full system access</p>
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
                      } else if (item.label === 'Team Management') {
                        navigate('/management/team');
                      } else if (item.label === 'Analytics Dashboard') {
                        navigate('/management');
                      } else if (item.label === 'Performance Reports') {
                        navigate('/management/reports');
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
                                <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-purple-100 text-purple-700">
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
          <p className="text-xs text-gray-500">Management Portal v2.1.0</p>
        </div>
      </div>
    </div>
  );
};