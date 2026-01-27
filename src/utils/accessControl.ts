import { UserRole, Job } from '../types';

export const canAccessRoute = (role: UserRole, path: string): boolean => {
  const rolePermissions: Record<UserRole, string[]> = {
    client: [
      '/client',
      '/client/dashboard',
      '/client/book',
      '/client/history',
      '/client/reports',
      '/client/profile',
      '/client/help',
    ],
    admin: [
      '/admin',
      '/admin/dashboard',
      '/admin/create-job',
      '/admin/assign-crew',
      '/admin/bookings',
      '/admin/crew',
      '/admin/sla',
      '/admin/reports',
      '/admin/approvals',
      '/admin/help',
    ],
    crew: [
      '/crew',
      '/crew/dashboard',
      '/crew/job',
      '/crew/history',
      '/crew/workflow',
      '/crew/profile',
      '/crew/help',
    ],
    management: [
      '/management',
      '/management/dashboard',
      '/management/performance',
      '/management/help',
    ],
    sales: [
      '/sales',
      '/sales/dashboard',
      '/sales/leads',
      '/sales/clients',
      '/sales/help',
    ],
  };

  const allowedPaths = rolePermissions[role] || [];
  return allowedPaths.some(allowed => path.startsWith(allowed));
};

export const canViewJob = (role: UserRole, job: Job, userId: string): boolean => {
  switch (role) {
    case 'client':
      return job.clientId === userId;
    case 'crew':
      return job.crewAssigned?.includes(userId) || false;
    case 'admin':
    case 'management':
      return true;
    case 'sales':
      return job.clientId === userId;
    default:
      return false;
  }
};

export const canModifyJob = (role: UserRole, job: Job): boolean => {
  if (role === 'admin') return true;
  if (job.lifecycleState === 'invoiced') return false;
  return false;
};

export const canDispatchJob = (role: UserRole): boolean => {
  return role === 'admin';
};

export const canCompleteJob = (role: UserRole, job: Job, userId: string): boolean => {
  if (role !== 'crew') return false;
  return job.crewAssigned?.includes(userId) || false;
};

export const canVerifyJob = (role: UserRole): boolean => {
  return role === 'admin';
};

export const canAccessReports = (role: UserRole, job?: Job): boolean => {
  if (role === 'admin' || role === 'management') return true;
  if (role === 'client' && job) {
    return job.lifecycleState === 'completed' || 
           job.lifecycleState === 'verified' || 
           job.lifecycleState === 'invoiced';
  }
  return false;
};

export const canAccessInvoices = (role: UserRole, job?: Job): boolean => {
  if (role === 'admin' || role === 'management') return true;
  if (role === 'client' && job) {
    return job.lifecycleState === 'invoiced';
  }
  return false;
};

export const canCreateJob = (role: UserRole): boolean => {
  return role === 'admin';
};

export const getDefaultRoute = (role: UserRole): string => {
  const routes: Record<UserRole, string> = {
    client: '/client/dashboard',
    admin: '/admin/dashboard',
    crew: '/crew/dashboard',
    management: '/management/dashboard',
    sales: '/sales/dashboard',
  };
  return routes[role] || '/';
};

export const shouldRedirectToJobAction = (role: UserRole, job: Job): string | null => {
  if (role === 'admin' && job.lifecycleState === 'created') {
    return '/admin/assign-crew';
  }
  if (role === 'crew' && job.lifecycleState === 'dispatched') {
    return `/crew/job/${job.id}`;
  }
  return null;
};
