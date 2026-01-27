import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import {
  LayoutDashboard, 
  Package, 
  History, 
  FileText, 
  PlusCircle, 
  Users, 
  AlertCircle, 
  BarChart3,
  ClipboardList,
  UserCircle,
  HelpCircle,
  TrendingUp,
  CheckCircle,
  Headphones,
  MapPin,
  DollarSign
} from 'lucide-react';

// Lazy load dashboard components
const ClientDashboard = lazy(() => import('./dashboards/client/ClientDashboard').then(m => ({ default: m.ClientDashboard })));
const RequestBooking = lazy(() => import('./dashboards/client/RequestBooking').then(m => ({ default: m.RequestBooking })));
const ClientQuoteApproval = lazy(() => import('./dashboards/client/ClientQuoteApproval').then(m => ({ default: m.ClientQuoteApproval })));
const ClientPaymentDetails = lazy(() => import('./dashboards/client/ClientPaymentDetails').then(m => ({ default: m.ClientPaymentDetails })));
const ClientFinalPayment = lazy(() => import('./dashboards/client/ClientFinalPayment').then(m => ({ default: m.ClientFinalPayment })));
const ClientHistory = lazy(() => import('./dashboards/client/ClientHistory').then(m => ({ default: m.ClientHistory })));
const ClientInvoices = lazy(() => import('./dashboards/client/ClientInvoices').then(m => ({ default: m.ClientInvoices })));
const JobTrackingModern = lazy(() => import('./dashboards/client/JobTrackingModern').then(m => ({ default: m.JobTrackingModern })));

const ClientProfile = lazy(() => import('./dashboards/client/ClientProfile').then(m => ({ default: m.ClientProfile })));
const ClientHelpSupport = lazy(() => import('./dashboards/client/ClientHelpSupport').then(m => ({ default: m.ClientHelpSupport })));

const CrewProfile = lazy(() => import('./dashboards/crew/CrewProfile').then(m => ({ default: m.CrewProfile })));
const CrewHelpSupport = lazy(() => import('./dashboards/crew/CrewHelpSupport').then(m => ({ default: m.CrewHelpSupport })));

const AdminDashboard = lazy(() => import('./dashboards/admin/AdminDashboardSimple').then(m => ({ default: m.AdminDashboard })));
const AdminProfile = lazy(() => import('./dashboards/admin/AdminProfile').then(m => ({ default: m.AdminProfile })));
const AdminHelpSupport = lazy(() => import('./dashboards/admin/AdminHelpSupport').then(m => ({ default: m.AdminHelpSupport })));
const UserApproval = lazy(() => import('./dashboards/admin/UserApproval').then(m => ({ default: m.UserApproval })));
const QuoteManagement = lazy(() => import('./dashboards/admin/QuoteManagement').then(m => ({ default: m.QuoteManagement })));
const AssignCrewModern = lazy(() => import('./dashboards/admin/AssignCrewModern').then(m => ({ default: m.AssignCrewModern })));
const PaymentTracking = lazy(() => import('./dashboards/admin/PaymentTracking').then(m => ({ default: m.PaymentTracking })));
const JobVerification = lazy(() => import('./dashboards/admin/JobVerification').then(m => ({ default: m.JobVerification })));

const CrewDashboard = lazy(() => import('./dashboards/crew/CrewDashboard').then(m => ({ default: m.CrewDashboard })));
const JobDetailsModernEnhanced = lazy(() => import('./dashboards/crew/JobDetailsModernEnhanced').then(m => ({ default: m.JobDetailsModernEnhanced })));

const ManagementDashboard = lazy(() => import('./dashboards/management/ManagementDashboard').then(m => ({ default: m.ManagementDashboard })));
const ManagementHelpSupport = lazy(() => import('./dashboards/management/ManagementHelpSupport').then(m => ({ default: m.ManagementHelpSupport })));
const ManagementProfile = lazy(() => import('./dashboards/management/ManagementProfile').then(m => ({ default: m.ManagementProfile })));
const TeamPerformance = lazy(() => import('./dashboards/management/TeamPerformance').then(m => ({ default: m.TeamPerformance })));

const SalesDashboard = lazy(() => import('./dashboards/sales/SalesDashboard').then(m => ({ default: m.SalesDashboard })));
const SalesHelpSupport = lazy(() => import('./dashboards/sales/SalesHelpSupport').then(m => ({ default: m.SalesHelpSupport })));
const SalesProfile = lazy(() => import('./dashboards/sales/SalesProfile').then(m => ({ default: m.SalesProfile })));
const LeadsPipeline = lazy(() => import('./dashboards/sales/LeadsPipeline').then(m => ({ default: m.LeadsPipeline })));
const SalesClients = lazy(() => import('./dashboards/sales/SalesClients').then(m => ({ default: m.SalesClients })));

const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const SignUp = lazy(() => import('./pages/SignUp').then(m => ({ default: m.SignUp })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const AccessDenied = lazy(() => import('./pages/AccessDenied').then(m => ({ default: m.AccessDenied })));
const NewLanding = lazy(() => import('./pages/NewLanding').then(m => ({ default: m.NewLanding })));
const PublicBooking = lazy(() => import('./pages/PublicBooking').then(m => ({ default: m.PublicBooking })));
const BookingWizard = lazy(() => import('./pages/BookingWizard').then(m => ({ default: m.BookingWizard })));
const BookingDashboardDemo = lazy(() => import('./pages/BookingDashboardDemo').then(m => ({ default: m.BookingDashboardDemo })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const roleNavigation = {
  client: [
    { label: 'Dashboard', path: '/client', icon: LayoutDashboard },
    { label: 'Quote Approval', path: '/client/quotes', icon: CheckCircle },
    { label: 'Payment', path: '/client/payment', icon: DollarSign },
    { label: 'Job Tracking', path: '/client/tracking', icon: MapPin },
    { label: 'Job History', path: '/client/history', icon: History },
    { label: 'Invoices', path: '/client/invoices', icon: FileText },
    { label: 'Profile', path: '/client/profile', icon: UserCircle },
    { label: 'Help & Support', path: '/client/help', icon: HelpCircle },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'User Approvals', path: '/admin/users', icon: Users },
    { label: 'Quote Management', path: '/admin/quotes', icon: FileText },
    { label: 'Assign Crew', path: '/admin/assign-crew', icon: Users },
    { label: 'Job Verification', path: '/admin/verification', icon: CheckCircle },
    { label: 'Payment Tracking', path: '/admin/payments', icon: DollarSign },
    { label: 'Profile', path: '/admin/profile', icon: UserCircle },
    { label: 'Help & Support', path: '/admin/help', icon: HelpCircle },
  ],
  crew: [
    { label: 'My Jobs', path: '/crew', icon: Package },
    { label: 'Profile', path: '/crew/profile', icon: UserCircle },
    { label: 'Help & Support', path: '/crew/help', icon: HelpCircle },
  ],
  management: [
    { label: 'Analytics', path: '/management', icon: BarChart3 },
    { label: 'Team Performance', path: '/management/team', icon: Users },
    { label: 'Profile', path: '/management/profile', icon: UserCircle },
    { label: 'Help & Support', path: '/management/help', icon: HelpCircle },
  ],
  sales: [
    { label: 'Pipeline', path: '/sales', icon: Users },
    { label: 'Leads', path: '/sales/leads', icon: TrendingUp },
    { label: 'Clients', path: '/sales/clients', icon: Package },
    { label: 'Profile', path: '/sales/profile', icon: UserCircle },
    { label: 'Help & Support', path: '/sales/help', icon: HelpCircle },
  ],
};

const roleTitles = {
  client: 'Client Portal',
  admin: 'Operations',
  crew: 'Crew Portal',
  management: 'Management',
  sales: 'Sales',
};

function App() {
  const AppContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isLoading } = useAuth();

    // Auto-redirect authenticated users to their dashboard
    useEffect(() => {
      if (!isLoading && user && location.pathname === '/') {
        const dashboardPath = `/${user.role}`;
        navigate(dashboardPath, { replace: true });
      }
    }, [user, isLoading, location.pathname, navigate]);

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    // Show loading while checking authentication
    if (isLoading) {
      return <LoadingFallback />;
    }

    const ClientRoutes = () => (
      <ProtectedRoute allowedRoles={['client']}>
        <DashboardLayout
          navItems={roleNavigation.client}
          title={roleTitles.client}
          user={user || { id: '1', name: 'Westminster Council', email: 'client@example.com', role: 'client' }}
          onLogout={handleLogout}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<ClientDashboard />} />
              <Route path="/request-booking" element={<RequestBooking />} />
              <Route path="/quotes" element={<ClientQuoteApproval />} />
              <Route path="/payment" element={<ClientPaymentDetails />} />
              <Route path="/history" element={<ClientHistory />} />
              <Route path="/invoices" element={<ClientInvoices />} />
              <Route path="/tracking" element={<JobTrackingModern />} />
              <Route path="/tracking/:jobId" element={<JobTrackingModern />} />
              <Route path="/profile" element={<ClientProfile />} />
              <Route path="/help" element={<ClientHelpSupport />} />
            </Routes>
          </Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    );

    const AdminRoutes = () => (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardLayout
          navItems={roleNavigation.admin}
          title={roleTitles.admin}
          user={user || { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'admin' }}
          onLogout={handleLogout}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/users" element={<UserApproval />} />
              <Route path="/quotes" element={<QuoteManagement />} />
              <Route path="/assign-crew" element={<AssignCrewModern />} />
              <Route path="/verification" element={<JobVerification />} />
              <Route path="/payments" element={<PaymentTracking />} />
              <Route path="/profile" element={<AdminProfile />} />
              <Route path="/help" element={<AdminHelpSupport />} />
            </Routes>
          </Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    );

    const CrewRoutes = () => (
      <ProtectedRoute allowedRoles={['crew']}>
        <DashboardLayout
          navItems={roleNavigation.crew}
          title={roleTitles.crew}
          user={user || { id: '3', name: 'Crew Member', email: 'crew@example.com', role: 'crew' }}
          onLogout={handleLogout}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<CrewDashboard />} />
              <Route path="/job/:jobId" element={<JobDetailsModernEnhanced />} />
              <Route path="/profile" element={<CrewProfile />} />
              <Route path="/help" element={<CrewHelpSupport />} />
            </Routes>
          </Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    );

    const ManagementRoutes = () => (
      <ProtectedRoute allowedRoles={['management']}>
        <DashboardLayout
          navItems={roleNavigation.management}
          title={roleTitles.management}
          user={user || { id: '4', name: 'Manager', email: 'manager@example.com', role: 'management' }}
          onLogout={handleLogout}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<ManagementDashboard />} />
              <Route path="/team" element={<TeamPerformance />} />
              <Route path="/profile" element={<ManagementProfile />} />
              <Route path="/help" element={<ManagementHelpSupport />} />
            </Routes>
          </Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    );

    const SalesRoutes = () => (
      <ProtectedRoute allowedRoles={['sales']}>
        <DashboardLayout
          navItems={roleNavigation.sales}
          title={roleTitles.sales}
          user={user || { id: '5', name: 'Sales Rep', email: 'sales@example.com', role: 'sales' }}
          onLogout={handleLogout}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<SalesDashboard />} />
              <Route path="/leads" element={<LeadsPipeline />} />
              <Route path="/clients" element={<SalesClients />} />
              <Route path="/profile" element={<SalesProfile />} />
              <Route path="/help" element={<SalesHelpSupport />} />
            </Routes>
          </Suspense>
        </DashboardLayout>
      </ProtectedRoute>
    );

    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="/booking" element={<PublicBooking />} />
          <Route path="/booking/*" element={<BookingWizard />} />
          <Route path="/booking-dashboard-demo" element={<BookingDashboardDemo />} />
          <Route path="/client/*" element={<ClientRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/crew/*" element={<CrewRoutes />} />
          <Route path="/management/*" element={<ManagementRoutes />} />
          <Route path="/sales/*" element={<SalesRoutes />} />
          <Route path="/" element={<NewLanding />} />
        </Routes>
      </Suspense>
    );
  };

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;