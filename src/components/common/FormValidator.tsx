import React, { useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { FormErrorBoundary, validateRequired, validateEmail, validatePhone } from './ErrorBoundary';

interface ValidationRule {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface FieldConfig {
  [fieldName: string]: ValidationRule;
}

interface FormValidatorProps {
  children: React.ReactNode;
  validationConfig: FieldConfig;
  onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void;
}

interface ValidationState {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
}

export const FormValidator: React.FC<FormValidatorProps> = ({
  children,
  validationConfig,
  onValidationChange
}) => {
  const [validation, setValidation] = useState<ValidationState>({
    errors: {},
    touched: {},
    isValid: true
  });

  const validateField = useCallback((fieldName: string, value: any): string | null => {
    const rules = validationConfig[fieldName];
    if (!rules) return null;

    try {
      // Required validation
      if (rules.required) {
        validateRequired(value, fieldName);
      }

      // Skip other validations if field is empty and not required
      if (!value && !rules.required) return null;

      // Email validation
      if (rules.email) {
        validateEmail(value);
      }

      // Phone validation
      if (rules.phone) {
        validatePhone(value);
      }

      // Length validations
      if (rules.minLength && value.length < rules.minLength) {
        return `${fieldName} must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `${fieldName} must not exceed ${rules.maxLength} characters`;
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        return `${fieldName} format is invalid`;
      }

      // Custom validation
      if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) return customError;
      }

      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'Validation failed';
    }
  }, [validationConfig]);

  const validateForm = useCallback((formData: Record<string, any>) => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(validationConfig).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    const isValid = Object.keys(newErrors).length === 0;
    
    setValidation(prev => ({
      ...prev,
      errors: newErrors,
      isValid
    }));

    onValidationChange?.(isValid, newErrors);
    
    return isValid;
  }, [validationConfig, validateField, onValidationChange]);

  const markFieldTouched = useCallback((fieldName: string) => {
    setValidation(prev => ({
      ...prev,
      touched: { ...prev.touched, [fieldName]: true }
    }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setValidation(prev => ({
      ...prev,
      errors: { ...prev.errors, [fieldName]: '' }
    }));
  }, []);

  // Provide validation context to children
  const validationContext = {
    validateField,
    validateForm,
    markFieldTouched,
    clearFieldError,
    errors: validation.errors,
    touched: validation.touched,
    isValid: validation.isValid
  };

  return (
    <FormErrorBoundary>
      <ValidationContext.Provider value={validationContext}>
        {children}
      </ValidationContext.Provider>
    </FormErrorBoundary>
  );
};

// Context for validation state
const ValidationContext = React.createContext<{
  validateField: (fieldName: string, value: any) => string | null;
  validateForm: (formData: Record<string, any>) => boolean;
  markFieldTouched: (fieldName: string) => void;
  clearFieldError: (fieldName: string) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
} | null>(null);

// Hook to use validation context
export const useFormValidation = () => {
  const context = React.useContext(ValidationContext);
  if (!context) {
    throw new Error('useFormValidation must be used within FormValidator');
  }
  return context;
};

// Validated input component
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldName: string;
  label?: string;
  showValidIcon?: boolean;
}

export const ValidatedInput: React.FC<ValidatedInputProps> = ({
  fieldName,
  label,
  showValidIcon = true,
  className = '',
  onBlur,
  onChange,
  ...props
}) => {
  const { validateField, markFieldTouched, clearFieldError, errors, touched } = useFormValidation();
  
  const hasError = touched[fieldName] && errors[fieldName];
  const isValid = touched[fieldName] && !errors[fieldName] && props.value;

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    markFieldTouched(fieldName);
    validateField(fieldName, e.target.value);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (hasError) {
      clearFieldError(fieldName);
    }
    onChange?.(e);
  };

  const inputClasses = `
    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-colors
    ${hasError 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : isValid && showValidIcon
        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          {...props}
          className={inputClasses}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        
        {showValidIcon && isValid && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
        )}
        
        {hasError && (
          <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" size={20} />
        )}
      </div>
      
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertTriangle size={14} />
          {errors[fieldName]}
        </p>
      )}
    </div>
  );
};

// Form submission wrapper with validation
interface SafeFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onValidSubmit: (formData: FormData, isValid: boolean) => void | Promise<void>;
  children: React.ReactNode;
}

export const SafeForm: React.FC<SafeFormProps> = ({
  onValidSubmit,
  onSubmit,
  children,
  ...props
}) => {
  const { validateForm, isValid } = useFormValidation();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const formObject = Object.fromEntries(formData.entries());
    
    const formIsValid = validateForm(formObject);
    
    try {
      await onValidSubmit(formData, formIsValid);
      onSubmit?.(e);
    } catch (error) {
      console.error('Form submission error:', error);
      // Error will be caught by ErrorBoundary
      throw error;
    }
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      {children}
    </form>
  );
};