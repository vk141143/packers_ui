import React, { ReactNode } from 'react';
import { UserRole, Job } from '../../types';

interface CanProps {
  perform: 
    | 'view-job'
    | 'edit-job'
    | 'delete-job'
    | 'assign-crew'
    | 'dispatch-job'
    | 'complete-job'
    | 'verify-job'
    | 'create-job'
    | 'view-reports'
    | 'view-invoices'
    | 'manage-users';
  role: UserRole;
  userId?: string;
  on?: Job;
  fallback?: ReactNode;
  children: ReactNode;
}

const checkPermission = (
  role: UserRole,
  action: CanProps['perform'],
  job?: Job,
  userId?: string
): boolean => {
  switch (action) {
    case 'view-job':
      if (role === 'admin' || role === 'management') return true;
      if (role === 'client' && job) return job.clientId === userId;
      if (role === 'crew' && job) return job.crewIds?.includes(userId || '') || false;
      return false;

    case 'edit-job':
      return role === 'admin';

    case 'delete-job':
      return role === 'admin';

    case 'assign-crew':
      return role === 'admin';

    case 'dispatch-job':
      return role === 'admin';

    case 'complete-job':
      if (role !== 'crew' || !job) return false;
      return job.crewIds?.includes(userId || '') || false;

    case 'verify-job':
      return role === 'admin';

    case 'create-job':
      return role === 'admin' || role === 'client';

    case 'view-reports':
      if (role === 'admin' || role === 'management') return true;
      if (role === 'client' && job) {
        return job.lifecycleState === 'completed' || 
               job.lifecycleState === 'invoiced';
      }
      return false;

    case 'view-invoices':
      if (role === 'admin' || role === 'management') return true;
      if (role === 'client' && job) {
        return job.lifecycleState === 'invoiced';
      }
      return false;

    case 'manage-users':
      return role === 'admin';

    default:
      return false;
  }
};

export const Can: React.FC<CanProps> = ({
  perform,
  role,
  userId,
  on,
  fallback = null,
  children
}) => {
  const allowed = checkPermission(role, perform, on, userId);
  return allowed ? <>{children}</> : <>{fallback}</>;
};
