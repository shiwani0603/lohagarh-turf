export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,

  // Bookings
  BOOKINGS: `${API_BASE_URL}/bookings`,
  MY_BOOKINGS: `${API_BASE_URL}/bookings/my`,
  BOOKING_DETAIL: (id: string) => `${API_BASE_URL}/bookings/${id}`,
  CANCEL_BOOKING: (id: string) => `${API_BASE_URL}/bookings/${id}/cancel`,

  // Time Slots
  TIME_SLOTS: `${API_BASE_URL}/time-slots`,
  AVAILABLE_SLOTS: `${API_BASE_URL}/time-slots/available`,

  // Payments
  CREATE_PAYMENT: `${API_BASE_URL}/payments/create`,
  VERIFY_PAYMENT: `${API_BASE_URL}/payments/verify`,
  PAYMENT_HISTORY: `${API_BASE_URL}/payments`,

  // Coupons
  VALIDATE_COUPON: `${API_BASE_URL}/coupons/validate`,
  APPLY_COUPON: `${API_BASE_URL}/coupons/apply`,

  // Reviews
  REVIEWS: `${API_BASE_URL}/reviews`,
  CREATE_REVIEW: `${API_BASE_URL}/reviews`,

  // Settings
  SETTINGS: `${API_BASE_URL}/settings`,

  // User
  PROFILE: `${API_BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
};

// Date formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const TIME_FORMAT = 'HH:mm';

// Status constants
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  INVALID_INPUT: 'Please check your input and try again.',
  BOOKING_FAILED: 'Booking failed. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking created successfully!',
  PAYMENT_SUCCESS: 'Payment successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  COUPON_APPLIED: 'Coupon applied successfully!',
};
