import userApi from '../Services/userApi';
import adminApi from '../Services/adminApi';
import affiliateApi from '../Services/affiliateApi';

// Setup response interceptors to handle token expiration and errors
export const setupApiInterceptors = (navigate, logoutUser, logoutAdmin, logoutAffiliate) => {
  
  // User API interceptor
  userApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logoutUser();
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  // Admin API interceptor
  adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logoutAdmin();
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  // Affiliate API interceptor
  affiliateApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logoutAffiliate();
        navigate('/affiliatesLogin');
      }
      return Promise.reject(error);
    }
  );
};

// Prevent token exposure in console
export const sanitizeConsole = () => {
  if (process.env.NODE_ENV === 'production') {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    const sanitize = (args) => {
      return args.map(arg => {
        if (typeof arg === 'string') {
          // Remove any tokens from strings
          return arg.replace(/Bearer\s+[\w-]+\.[\w-]+\.[\w-]+/gi, 'Bearer [REDACTED]')
                    .replace(/token["\s:=]+[\w-]+\.[\w-]+\.[\w-]+/gi, 'token: [REDACTED]');
        }
        if (typeof arg === 'object' && arg !== null) {
          // Remove tokens from objects
          const sanitized = { ...arg };
          if (sanitized.token) sanitized.token = '[REDACTED]';
          if (sanitized.access_token) sanitized.access_token = '[REDACTED]';
          if (sanitized.Authorization) sanitized.Authorization = 'Bearer [REDACTED]';
          return sanitized;
        }
        return arg;
      });
    };

    console.log = (...args) => originalLog(...sanitize(args));
    console.warn = (...args) => originalWarn(...sanitize(args));
    console.error = (...args) => originalError(...sanitize(args));
  }
};

// Prevent right-click and inspect element in production
export const disableDevTools = () => {
  if (process.env.NODE_ENV === 'production') {
    // Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    });

    // Detect if DevTools is open
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        // DevTools might be open - you can redirect or show warning
        console.log('Developer tools detected');
      }
    };

    setInterval(detectDevTools, 1000);
  }
};

// Clear sensitive data from localStorage on window close
export const setupStorageCleanup = () => {
  window.addEventListener('beforeunload', () => {
    // Optionally clear tokens on browser close (be careful with this)
    // sessionStorage.clear();
  });
};

// Validate token format for Laravel Sanctum tokens
export const isValidToken = (token) => {
  if (!token) return false;
  if (typeof token !== 'string') return false;
  
  // Laravel Sanctum tokens are plain text tokens (not JWT)
  // They typically look like: "1|randomstring" or just a long random string
  // Check if token is at least 40 characters and contains valid characters
  const tokenPattern = /^[\w|]+$/;
  return token.length >= 40 && tokenPattern.test(token);
};

// Check if token is expired (for Laravel Sanctum, we can't check expiration client-side)
// The server will return 401 if token is expired/invalid
export const isTokenExpired = (token) => {
  // For Laravel Sanctum, we can't determine expiration client-side
  // Always return false and let the server handle it
  // The API interceptors will catch 401 errors and logout the user
  return false;
};