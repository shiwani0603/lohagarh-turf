/**
 * Storage utilities
 */

export const storage = {
  // Get item from localStorage
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  // Set item in localStorage
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },

  // Remove item from localStorage
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage error:', e);
    }
  },

  // Clear all storage
  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
};

// Auth token helpers
export const authStorage = {
  getToken: () => storage.get('token'),
  setToken: (token: string) => storage.set('token', token),
  removeToken: () => storage.remove('token'),

  getUser: () => storage.get('user'),
  setUser: (user: any) => storage.set('user', user),
  removeUser: () => storage.remove('user'),
};
