import React, { useState } from 'react';
import { QuoteSubmissionForm } from './QuoteSubmissionForm';
import { OpsReviewDashboard } from './OpsReviewDashboard';
import { ClientApprovalDashboard } from './ClientApprovalDashboard';
import { JobManagementDashboard } from './JobManagementDashboard';
import { QualityVerificationDashboard } from './QualityVerificationDashboard';

type View = 'quote' | 'ops' | 'client' | 'jobs' | 'quality';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('quote');

  const renderView = () => {
    switch (currentView) {
      case 'quote':
        return <QuoteSubmissionForm />;
      case 'ops':
        return <OpsReviewDashboard />;
      case 'client':
        return <ClientApprovalDashboard />;
      case 'jobs':
        return <JobManagementDashboard />;
      case 'quality':
        return <QualityVerificationDashboard />;
      default:
        return <QuoteSubmissionForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView('quote')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'quote'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              1. Quote Submission
            </button>
            <button
              onClick={() => setCurrentView('ops')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'ops'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              2. Operations Review
            </button>
            <button
              onClick={() => setCurrentView('client')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'client'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              3. Client Approval
            </button>
            <button
              onClick={() => setCurrentView('jobs')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              4. Job Management
            </button>
            <button
              onClick={() => setCurrentView('quality')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                currentView === 'quality'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              5. Quality Verification
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        {renderView()}
      </main>
    </div>
  );
};