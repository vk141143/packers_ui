import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
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
  Package,
  Users,
  Phone,
  Mail,
  LogOut,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  FileText,
  MapPin
} from 'lucide-react';

export const ModernAdminProfile: React.FC = () => {
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
        <HelpSupport userRole="admin" />
      </div>
    );
  }
  const userStats = [
    { label: "Jobs Managed", value: "247", icon: Package },
    { label: "Crew Teams", value: "12", icon: Users },
    { label: "SLA Rate", value: "94%", icon: CheckCircle },
  ];

  const menuItems = [
    {
      section: "Account",
      items: [
        { icon: User, label: "Edit Profile", description: "Name, phone, email" },
        { icon: MapPin, label: "Office Location", description: "London HQ" },
        { icon: Shield, label: "Admin Permissions", description: "Full system access", badge: "Admin" },
      ],
    },
    {
      section: "Operations",
      items: [
        { icon: Package, label: "Job Management", description: "Create & assign jobs" },
        { icon: Users, label: "Crew Management", description: "Team assignments", badge: "12" },
        { icon: CheckCircle, label: "Job Verification", description: "Quality control" },
        { icon: AlertCircle, label: "SLA Monitoring", description: "Performance tracking" },
        { icon: FileText, label: "Reports", description: "Analytics & insights" },
      ],
    },
    {
      section: "Settings",
      items: [
        { icon: Bell, label: "Notifications", description: "System alerts" },
        { icon: HelpCircle, label: "Help & Support", description: "Admin resources" },
        { icon: Shield, label: "Security Settings", description: "Account protection" },
        { icon: Settings, label: "System Preferences", description: "Admin settings" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 pt-8 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-2xl font-bold">Admin Profile</h1>
            <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
              <Settings className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="size-20 border-4 border-white shadow-lg">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" />
              <AvatarFallback className="text-xl bg-white text-blue-600">SJ</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold">Sarah Johnson</h2>
              <p className="text-white/90 text-sm">Operations Manager</p>
              <p className="text-white/90 text-sm flex items-center gap-1">
                <Phone className="size-3" />
                +44 7700 900456
              </p>
              <p className="text-white/90 text-sm flex items-center gap-1">
                <Mail className="size-3" />
                sarah@moveaway.co.uk
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
                <stat.icon className="size-5 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6 bg-gradient-to-r from-red-500 to-red-600 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Shield className="size-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Administrator</h3>
                  <p className="text-white/90 text-sm">Full system privileges</p>
                </div>
              </div>
              <ChevronRight className="size-5 text-white" />
            </div>
          </CardContent>
        </Card>

        {/* Admin Info Card */}
        <Card className="mb-6 bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Admin Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Department</p>
                <p className="font-medium">Operations</p>
              </div>
              <div>
                <p className="text-gray-600">Location</p>
                <p className="font-medium">London HQ</p>
              </div>
              <div>
                <p className="text-gray-600">Join Date</p>
                <p className="font-medium">March 15, 2022</p>
              </div>
              <div>
                <p className="text-gray-600">Employee ID</p>
                <p className="font-medium">ADM-001</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 text-sm mb-2">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {['Job Management', 'Crew Assignment', 'SLA Monitoring', 'Client Management', 'System Admin'].map((permission) => (
                  <Badge key={permission} variant="secondary" className="bg-blue-100 text-blue-800">
                    {permission}
                  </Badge>
                ))}
              </div>
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
                      } else if (item.label === 'Job Management') {
                        navigate('/admin');
                      } else if (item.label === 'Crew Management') {
                        navigate('/admin/assign-crew');
                      } else if (item.label === 'Job Verification') {
                        navigate('/admin/verification');
                      } else if (item.label === 'SLA Monitoring') {
                        navigate('/admin/operations');
                      } else if (item.label === 'Reports') {
                        navigate('/admin/reports');
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
                                <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-blue-100 text-blue-700">
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
                  <p className="text-sm text-gray-600">Sign out of admin account</p>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center pb-8">
          <p className="text-xs text-gray-500">Admin Portal v2.1.0</p>
        </div>
      </div>
    </div>
  );
};