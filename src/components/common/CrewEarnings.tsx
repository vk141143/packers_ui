import React from 'react';
import { Card, CardContent } from '../ui/card';
import { DollarSign, TrendingUp, Calendar, Award } from 'lucide-react';

export const CrewEarnings: React.FC = () => {
  const earningsData = {
    thisMonth: 3250,
    lastMonth: 2890,
    thisYear: 28500,
    totalJobs: 47,
    avgPerJob: 69,
    bonus: 450
  };

  const growth = ((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Monthly Earnings */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-lg text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">This Month</p>
              <p className="text-3xl font-bold">£{earningsData.thisMonth.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={16} />
                <span className="text-sm">+{growth}% from last month</span>
              </div>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <DollarSign size={32} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Calendar className="size-5 mx-auto mb-2 text-blue-600" />
            <p className="text-lg font-bold text-gray-900">£{earningsData.lastMonth.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Last Month</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <Award className="size-5 mx-auto mb-2 text-purple-600" />
            <p className="text-lg font-bold text-gray-900">£{earningsData.bonus}</p>
            <p className="text-xs text-gray-600">Bonus</p>
          </CardContent>
        </Card>
      </div>

      {/* Year Stats */}
      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Year Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Earnings</span>
              <span className="font-semibold">£{earningsData.thisYear.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jobs Completed</span>
              <span className="font-semibold">{earningsData.totalJobs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average per Job</span>
              <span className="font-semibold">£{earningsData.avgPerJob}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};