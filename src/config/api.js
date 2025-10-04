// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SEND_OTP: `${API_BASE_URL}/api/auth/send-otp`,
    VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
    FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
    RESET_PASSWORD_WITH_OTP: `${API_BASE_URL}/api/auth/reset-password-with-otp`,
  },

  // Houses/Properties
  HOUSES: {
    BASE: `${API_BASE_URL}/api/houses`,
    BY_ID: (id) => `${API_BASE_URL}/api/houses/${id}`,
    SEARCH: `${API_BASE_URL}/api/houses/search`,
  },

  // Users
  USERS: {
    PROFILE: (id) => `${API_BASE_URL}/api/users/profile/${id}`,
    UPDATE_PROFILE: (id) => `${API_BASE_URL}/api/users/profile/${id}`,
  },

  // Admin
  ADMIN: {
    LOGIN: `${API_BASE_URL}/api/admin/login`,
    USERS: `${API_BASE_URL}/api/admin/users`,
    OWNERS: `${API_BASE_URL}/api/admin/owners`,
    HOUSES: `${API_BASE_URL}/api/admin/houses`,
    VISIT_REQUESTS: `${API_BASE_URL}/api/admin/visit-requests`,
    STAY_BOOKINGS: `${API_BASE_URL}/api/admin/stay-bookings`,
    COMMENTS: `${API_BASE_URL}/api/admin/comments`,
    BOARDING_HOUSES: `${API_BASE_URL}/api/admin/boarding-houses`,
    WEBSITE_RATINGS: `${API_BASE_URL}/api/admin/website-ratings`,
    PAYMENTS: `${API_BASE_URL}/api/admin/payments`,
  },

  // Contact
  CONTACT: {
    SUBMIT: `${API_BASE_URL}/api/contact/submit`,
  },

  // Website Ratings
  WEBSITE_RATINGS: {
    SUBMIT: `${API_BASE_URL}/api/website-ratings/submit`,
    STATS: `${API_BASE_URL}/api/website-ratings/stats`,
  },

  // Bookings
  BOOKINGS: {
    BASE: `${API_BASE_URL}/api/bookings`,
    CREATE: `${API_BASE_URL}/api/bookings`,
  },

  // Payments
  PAYMENTS: {
    BASE: `${API_BASE_URL}/api/payments`,
    CREATE: `${API_BASE_URL}/api/payments`,
  },

  // Visit Requests
  VISIT_REQUESTS: {
    BASE: `${API_BASE_URL}/api/visit-requests`,
    CREATE: `${API_BASE_URL}/api/visit-requests`,
  },

  // Reviews
  REVIEWS: {
    BASE: `${API_BASE_URL}/api/reviews`,
    CREATE: `${API_BASE_URL}/api/reviews`,
  },

  // Favorites
  FAVORITES: {
    BASE: `${API_BASE_URL}/api/users/favorites`,
    ADD: `${API_BASE_URL}/api/users/favorites`,
    REMOVE: (id) => `${API_BASE_URL}/api/users/favorites/${id}`,
  },
};

export default API_BASE_URL;
