import React, { createContext, useContext, useState, useEffect } from 'react';
import userApi from '../Services/userApi';
import adminApi from '../Services/adminApi';
import affiliateApi from '../Services/affiliateApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [affiliate, setAffiliate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Setup API interceptors
  useEffect(() => {
    // User API interceptor
    const userInterceptor = userApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logoutUser();
        }
        return Promise.reject(error);
      }
    );

    // Admin API interceptor
    const adminInterceptor = adminApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logoutAdmin();
        }
        return Promise.reject(error);
      }
    );

    // Affiliate API interceptor
    const affiliateInterceptor = affiliateApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logoutAffiliate();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      userApi.interceptors.response.eject(userInterceptor);
      adminApi.interceptors.response.eject(adminInterceptor);
      affiliateApi.interceptors.response.eject(affiliateInterceptor);
    };
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    
    // Check user authentication
    const userToken = localStorage.getItem('token');
    if (userToken) {
      try {
        const { data } = await userApi.get('/user');
        setUser(data.user);
      } catch (error) {
        console.error('User auth check failed');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    // Check admin authentication
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      try {
        const { data } = await adminApi.get('/admin/dashboard');
        setAdmin(data.admin);
      } catch (error) {
        console.error('Admin auth check failed');
        localStorage.removeItem('adminToken');
      }
    }

    // Check affiliate authentication
    const affiliateToken = localStorage.getItem('affiliateToken');
    if (affiliateToken) {
      try {
        const { data } = await affiliateApi.get('/affiliate/dashboard');
        setAffiliate(data.affiliate);
      } catch (error) {
        console.error('Affiliate auth check failed');
        localStorage.removeItem('affiliateToken');
      }
    }

    setLoading(false);
  };

  const loginUser = (userData, token) => {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new Error('Invalid token format');
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const loginAdmin = (adminData, token) => {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new Error('Invalid token format');
    }
    localStorage.setItem('adminToken', token);
    setAdmin(adminData);
  };

  const loginAffiliate = (affiliateData, token) => {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new Error('Invalid token format');
    }
    localStorage.setItem('affiliateToken', token);
    setAffiliate(affiliateData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  const logoutAffiliate = () => {
    localStorage.removeItem('affiliateToken');
    setAffiliate(null);
  };

  const logoutAll = () => {
    logoutUser();
    logoutAdmin();
    logoutAffiliate();
  };

  const value = {
    user,
    admin,
    affiliate,
    loading,
    isAuthenticated: !!user || !!admin || !!affiliate,
    isUser: !!user,
    isAdmin: !!admin,
    isAffiliate: !!affiliate,
    loginUser,
    loginAdmin,
    loginAffiliate,
    logoutUser,
    logoutAdmin,
    logoutAffiliate,
    logoutAll,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};