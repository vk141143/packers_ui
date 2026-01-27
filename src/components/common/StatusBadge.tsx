import React, { useMemo } from 'react';
import { JobStatus } from '../../types';

interface StatusBadgeProps {
  status: JobStatus;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  created: { label: 'Created', className: 'bg-gray-100 text-gray-800' },
  Created: { label: 'Created', className: 'bg-gray-100 text-gray-800' },
  'pending-ops-review': { label: 'Ops Review', className: 'bg-yellow-100 text-yellow-800' },
  'ops-reviewing': { label: 'Reviewing', className: 'bg-yellow-100 text-yellow-800' },
  'quote-ready': { label: 'Quote Ready', className: 'bg-blue-100 text-blue-800' },
  'quote-sent': { label: 'Quote Sent', className: 'bg-blue-100 text-blue-800' },
  'awaiting-acceptance': { label: 'Awaiting Acceptance', className: 'bg-purple-100 text-purple-800' },
  'quote-accepted': { label: 'Quote Accepted', className: 'bg-green-100 text-green-800' },
  'deposit-required': { label: 'Deposit Required', className: 'bg-orange-100 text-orange-800' },
  'deposit-paid': { label: 'Deposit Paid', className: 'bg-green-100 text-green-800' },
  'crew-assigned': { label: 'Crew Assigned', className: 'bg-blue-100 text-blue-800' },
  dispatched: { label: 'Dispatched', className: 'bg-blue-100 text-blue-800' },
  Dispatched: { label: 'Dispatched', className: 'bg-blue-100 text-blue-800' },
  'crew-dispatched': { label: 'Crew Dispatched', className: 'bg-cyan-100 text-cyan-800' },
  'at-pickup': { label: 'At Pickup', className: 'bg-cyan-100 text-cyan-800' },
  packing: { label: 'Packing', className: 'bg-yellow-100 text-yellow-800' },
  'in-transit': { label: 'In Transit', className: 'bg-purple-100 text-purple-800' },
  'at-delivery': { label: 'At Delivery', className: 'bg-indigo-100 text-indigo-800' },
  unloading: { label: 'Unloading', className: 'bg-orange-100 text-orange-800' },
  'in-progress': { label: 'In Progress', className: 'bg-yellow-100 text-yellow-800' },
  'In Progress': { label: 'In Progress', className: 'bg-yellow-100 text-yellow-800' },
  'work-completed': { label: 'Work Done', className: 'bg-green-100 text-green-800' },
  scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-800' },
  'pending-verification': { label: 'Pending Verification', className: 'bg-orange-100 text-orange-800' },
  'Awaiting Verification': { label: 'Awaiting Verification', className: 'bg-orange-100 text-orange-800' },
  'admin-verified': { label: 'Verified', className: 'bg-purple-100 text-purple-800' },
  'final-invoice-sent': { label: 'Final Invoice Sent', className: 'bg-indigo-100 text-indigo-800' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
  verified: { label: 'Verified', className: 'bg-purple-100 text-purple-800' },
  Verified: { label: 'Verified', className: 'bg-purple-100 text-purple-800' },
  invoiced: { label: 'Invoiced', className: 'bg-emerald-100 text-emerald-800' },
  Invoiced: { label: 'Invoiced', className: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refunded', className: 'bg-red-100 text-red-800' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = React.memo(({ status }) => {
  const config = useMemo(() => statusConfig[status] || { label: status || 'Unknown', className: 'bg-gray-100 text-gray-800' }, [status]);
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
});
