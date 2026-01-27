import React from 'react';
import { AlertCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from './Button';

interface ErrorBannerProps {
  variant?: 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  variant = 'error',
  title,
  message,
  onRetry,
  onDismiss,
  className = ''
}) => {
  const config = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: XCircle,
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      messageColor: 'text-red-700',
      defaultTitle: 'Error'
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      titleColor: 'text-orange-900',
      messageColor: 'text-orange-700',
      defaultTitle: 'Warning'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-700',
      defaultTitle: 'Information'
    }
  }[variant];

  const Icon = config.icon;

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${config.iconColor} mt-0.5 flex-shrink-0`} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`font-semibold ${config.titleColor} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${config.messageColor}`}>
            {message}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="whitespace-nowrap"
            >
              Try Again
            </Button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`${config.iconColor} hover:opacity-70 transition-opacity`}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline error for forms
interface InlineErrorProps {
  message: string;
  id?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({ message, id }) => (
  <p
    id={id}
    role="alert"
    className="text-sm text-red-600 mt-1 flex items-center gap-1"
  >
    <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
    <span>{message}</span>
  </p>
);
