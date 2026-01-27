import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { KPI } from '../../types';

interface KPICardProps {
  kpi: KPI;
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{kpi.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
          {kpi.change !== undefined && (
            <div className="flex items-center mt-2">
              {kpi.trend === 'up' ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <span className={`text-sm ml-1 ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.change}%
              </span>
            </div>
          )}
        </div>
        {icon && <div className="text-primary-600">{icon}</div>}
      </div>
    </div>
  );
};
