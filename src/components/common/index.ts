// Error Boundary and Runtime Safety Components
export {
  ErrorBoundary,
  FormErrorBoundary,
  useSafeAsync,
  validateRequired,
  validateEmail,
  validatePhone
} from './ErrorBoundary';

export {
  FormValidator,
  ValidatedInput,
  SafeForm,
  useFormValidation
} from './FormValidator';

export {
  RuntimeSafety,
  SafeOperation,
  useMemoryLeakPrevention,
  PerformanceMonitor
} from './RuntimeSafety';

// Re-export existing components
export { CancellationGuard, useCancellationPolicy } from './CancellationGuard';

// Comprehensive safety wrapper for critical booking operations
export const BookingSafetyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RuntimeSafety 
      config={{ 
        criticalOperation: true, 
        requireNetwork: true,
        timeout: 45000 
      }}
    >
      <PerformanceMonitor>
        {children}
      </PerformanceMonitor>
    </RuntimeSafety>
  );
};

// Form validation configuration for booking forms
export const BOOKING_VALIDATION_CONFIG = {
  clientName: { required: true, minLength: 2, maxLength: 100 },
  clientEmail: { required: true, email: true },
  clientPhone: { required: true, phone: true },
  propertyAddress: { required: true, minLength: 10, maxLength: 200 },
  serviceType: { required: true },
  scheduledDate: { 
    required: true,
    custom: (value: string) => {
      const date = new Date(value);
      const now = new Date();
      if (date <= now) return 'Scheduled date must be in the future';
      return null;
    }
  }
};

import React from 'react';