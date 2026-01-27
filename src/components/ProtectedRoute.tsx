import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole, JobStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  allowedStatuses?: JobStatus[];
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  allowedStatuses = [],
  requireAuth = true
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthenticated = !!user;

  // Authentication guard
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role guard
  if (allowedRoles.length > 0 && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/access-denied" replace />;
  }

  // Status guard (for job-specific routes)
  if (allowedStatuses.length > 0 && user?.currentJobStatus && !allowedStatuses.includes(user.currentJobStatus)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

// Route protection utility
export const useRouteProtection = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  const canAccessRoute = (route: string, requiredRole?: UserRole) => {
    if (!isAuthenticated) return false;
    if (!requiredRole) return true;
    return user?.role === requiredRole;
  };
  
  const getRedirectPath = () => {
    if (!isAuthenticated) return '/login';
    if (!user) return '/login';
    
    switch (user.role) {
      case 'client': return '/client';
      case 'admin': return '/admin';
      case 'crew': return '/crew';
      case 'sales': return '/sales';
      case 'management': return '/management';
      default: return '/access-denied';
    }
  };
  
  return { canAccessRoute, getRedirectPath };
};