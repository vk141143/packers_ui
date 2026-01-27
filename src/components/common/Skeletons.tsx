import React from 'react';

export const JobCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="h-6 bg-gray-200 rounded w-24" />
      <div className="h-6 bg-gray-200 rounded w-20" />
    </div>
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
    <div className="space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
    <div className="flex items-center justify-between pt-3 border-t">
      <div className="h-4 bg-gray-200 rounded w-20" />
      <div className="h-6 bg-gray-200 rounded w-24" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="border-b border-gray-200 p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="border-b border-gray-200 p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-4 bg-gray-200 rounded w-28" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
    ))}
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="h-12 w-12 bg-gray-200 rounded-xl" />
      <div className="h-6 bg-gray-200 rounded w-16" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
    <div className="h-8 bg-gray-200 rounded w-20" />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b px-6 py-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-32" />
    </div>
    <div className="px-6 py-8 space-y-8">
      <div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
      <div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      </div>
    </div>
  </div>
);
