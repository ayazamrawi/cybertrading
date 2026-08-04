import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
// Loading component for protected routes
const RouteLoading = () => (
  <LoadingScreen/>
);

// Protected route for regular users
export const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (loading) {
    return <RouteLoading />;
  }

  // ✅ بدل infinite loading
  if (!user) {
    localStorage.removeItem("token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.email_verified_at === null) {
    return <Navigate to="/UnverifiedUsers" replace />;
  }

  return children;
};

// Protected route for admin users
export const AdminProtectedRoute = ({ children }) => {
  const { user, admin, loading } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2) لو فيه توكن ولسه بنعمل checkAuth
  if (loading) return <RouteLoading />;

  // 3) لو الـ context لسه فاضي لأي سبب -> استنى (مش تطردي)
  if (!admin && !(user && user.role === "admin")) {
    localStorage.removeItem("adminToken");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is logged in with admin role
  if (user && user.role === 'admin') {
    return children;
  }

  // Check if admin is logged in
  if (admin) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

// Protected route for affiliates
export const AffiliateProtectedRoute = ({ children }) => {
  const { affiliate, loading } = useAuth();
  const location = useLocation();

  // 1. ⚠️ هات التوكن بالاسم الصح اللي انت حفظته في التسجيل
  const token = localStorage.getItem("affiliateToken");

  // 2. لو مفيش توكن خالص، وديه Login
  if (!token) {
    return <Navigate to="/affiliatesLogin" state={{ from: location }} replace />;
  }

  // 3. لو التوكن موجود بس بيانات المسوق لسه مجاتش، استنى (Loading)
  if (loading || !affiliate) {
    return <RouteLoading />;
  }

  return children;
};

// 🔥 Public only route - منع أي حد مسجل دخوله من الوصول للصفحات العامة
export const PublicOnlyRoute = ({ children }) => {
  const { user, admin, affiliate, loading } = useAuth();

  if (loading) {
    return <RouteLoading />;
  }

  // لو User عادي مسجل دخول
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/adminDashboard" replace />;
    }
    return <Navigate to="/userDashboard" replace />;
  }

  // لو Admin مسجل دخول
  if (admin) {
    return <Navigate to="/adminDashboard" replace />;
  }

  // لو Affiliate مسجل دخول
  if (affiliate) {
    return <Navigate to="/affiliateDashboard" replace />;
  }

  // لو مفيش حد مسجل دخول، اعرض الصفحة العامة
  return children;
};

// 🔥 Affiliate Public Only - بس للـ Affiliate Login و Apply
export const AffiliatePublicRoute = ({ children }) => {
  const { user, admin, affiliate, loading } = useAuth();

  if (loading) {
    return <RouteLoading />;
  }

  // لو أي حد مسجل دخول (User, Admin, or Affiliate)
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/adminDashboard" replace />;
    }
    return <Navigate to="/userDashboard" replace />;
  }

  if (admin) {
    return <Navigate to="/adminDashboard" replace />;
  }

  if (affiliate) {
    return <Navigate to="/affiliateDashboard" replace />;
  }

  // لو مفيش حد مسجل دخول، اعرض صفحة الـ Affiliate
  return children;
};

// Route that requires a token in URL (for password reset, email verification)
export const TokenRequiredRoute = ({ children, tokenParam = 'token' }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get(tokenParam);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};