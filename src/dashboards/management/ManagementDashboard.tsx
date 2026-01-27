import React from 'react';
import { KPICard } from '../../components/common/KPICard';
import { TrendingUp, DollarSign, Package, Users, Clock, CheckCircle, Award, Target } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export const ManagementDashboard: React.FC = () => {
  const kpis = [
    { 
      label: 'Monthly Revenue', 
      value: formatCurrency(124500), 
      change: 12, 
      trend: 'up' as const,
      icon: <DollarSign size={32} />
    },
    { 
      label: 'Total Jobs', 
      value: 156, 
      change: 8, 
      trend: 'up' as const,
      icon: <Package size={32} />
    },
    { 
      label: 'Active Crew', 
      value: 24, 
      change: 0, 
      trend: 'up' as const,
      icon: <Users size={32} />
    },
    { 
      label: 'SLA Compliance', 
      value: '94%', 
      change: 2, 
      trend: 'up' as const,
      icon: <CheckCircle size={32} />
    },
    { 
      label: 'Avg. Job Value', 
      value: formatCurrency(2450), 
      change: 5, 
      trend: 'up' as const,
      icon: <TrendingUp size={32} />
    },
    { 
      label: 'Avg. Completion Time', 
      value: '22h', 
      change: -8, 
      trend: 'up' as const,
      icon: <Clock size={32} />
    },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 98000 },
    { month: 'Feb', revenue: 105000 },
    { month: 'Mar', revenue: 112000 },
    { month: 'Apr', revenue: 124500 },
  ];

  const clientBreakdown = [
    { type: 'Councils', percentage: 45, value: 56025 },
    { type: 'Insurance', percentage: 30, value: 37350 },
    { type: 'Corporate', percentage: 25, value: 31125 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" 
            alt="Analytics" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Award size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Executive Dashboard</h2>
              <p className="text-purple-200">Real-time business intelligence & KPIs</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="transform transition-all duration-300 hover:scale-105">
            <KPICard kpi={kpi} icon={kpi.icon} />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={24} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue Trend</h3>
          </div>
          <div className="space-y-4">
            {revenueData.map((data, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{data.month}</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(data.revenue)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500 hover:from-green-500 hover:to-green-700"
                    style={{ width: `${(data.revenue / 130000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Client Type Breakdown</h3>
          </div>
          <div className="space-y-4">
            {clientBreakdown.map((client, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{client.type}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {client.percentage}% ({formatCurrency(client.value)})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500 hover:from-blue-500 hover:to-blue-700"
                    style={{ width: `${client.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Package size={20} />
              Job Status
            </h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-bold text-green-600">89 (57%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-sm font-bold text-yellow-600">45 (29%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Scheduled</span>
              <span className="text-sm font-bold text-blue-600">22 (14%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <CheckCircle size={20} />
              SLA Performance
            </h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">On Time</span>
              <span className="text-sm font-bold text-green-600">147 (94%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Delayed</span>
              <span className="text-sm font-bold text-yellow-600">6 (4%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Breached</span>
              <span className="text-sm font-bold text-red-600">3 (2%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Award size={20} />
              Top Performers
            </h3>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mike Davies</span>
              <span className="text-sm font-bold text-gray-900">42 jobs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tom Brown</span>
              <span className="text-sm font-bold text-gray-900">38 jobs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">James Wilson</span>
              <span className="text-sm font-bold text-gray-900">35 jobs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
