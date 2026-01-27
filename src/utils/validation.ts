// Input validation utilities

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const numbersOnly = phone.replace(/[^0-9]/g, '');
  return numbersOnly.length >= 10;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
};

export const validatePostcode = (postcode: string): boolean => {
  // UK postcode format
  return /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i.test(postcode);
};

export const sanitizePhone = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

export const sanitizeAlphaNumeric = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9\s]/g, '');
};

export const sanitizeNumeric = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

export const sanitizeAlpha = (value: string): string => {
  return value.replace(/[^a-zA-Z\s]/g, '');
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 10;
};

export const validateDate = (date: string): boolean => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak';
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strength = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (strength >= 4) return 'strong';
  if (strength >= 3) return 'medium';
  return 'weak';
};

export const formatPhoneDisplay = (phone: string): string => {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
};
