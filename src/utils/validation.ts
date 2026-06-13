/**
 * Form validation utilities
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s+\-()]{10,}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateForm = (data: Record<string, any>, rules: Record<string, string[]>) => {
  const errors: Record<string, string> = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      const value = data[field];

      if (rule === 'required' && (!value || value.trim() === '')) {
        errors[field] = `${field} is required`;
        break;
      }

      if (rule === 'email' && !validateEmail(value)) {
        errors[field] = 'Invalid email address';
        break;
      }

      if (rule === 'phone' && !validatePhoneNumber(value)) {
        errors[field] = 'Invalid phone number';
        break;
      }

      if (rule === 'password' && !validatePassword(value)) {
        errors[field] = 'Password must be at least 6 characters';
        break;
      }
    }
  }

  return errors;
};
