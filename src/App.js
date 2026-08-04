import './App.css';
import Home from './Components/Home/Home';
import About from './Components/About/About';
import Affiliates from './Components/Affiliates/Affiliates';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import AffiliatesApply from './Components/AffiliatesApply/AffiliatesApply';
import AffiliateDashboard from './Components/AffiliateDashboard/AffiliateDashboard';
import AffiliatesLogin from './Components/AffiliateLogin/AffiliateLogin';
import Blog from './Components/Blog/Blog';
import Docs from './Components/Docs/Docs';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import UserDashboard from './Components/UserDashboard/UserDashboard';
import NotFound from './Components/NotFound/NotFound';
import Community from './Components/Community/Community';
import RegisterSuccess from './Components/RegisterSuccess/RegisterSuccess';
import SubscriptionSuccess from './Components/SubscriptionSuccess/SubscriptionSuccess';
import SubscriptionFailed from './Components/SubscriptionFailed/SubscriptionFailed';
import VerifyAccount from './Components/VerifyAccount/VerifyAccount';
import NewPassword from './Components/NewPassword/NewPassword';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import AffiliateNewPassword from './Components/AffiliateNewPassword/AffiliateNewPassword';
import AffiliateForgetPassword from './Components/AffiliateForgetPassword/AffiliateForgetPassword';
import AffiliateApplySuccess from './Components/AffiliateApplySuccess/AffiliateApplySuccess';
import AffiliateVerifyAccount from './Components/AffiliateVerifyAccount/AffiliateVerifyAccount';
import LoadingScreen from './Components/LoadingScreen/LoadingScreen';
import Layout from './Components/Layout/Layout';
import Pricing from './Components/Pricing/Pricing';
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GoogleCallback from './Components/GoogleCallback/GoogleCallback';
import UnverifiedUsers from './Components/UnverifiedUsers/UnverifiedUsers';
import { AuthProvider } from './Context/AuthContext';
import {
  UserProtectedRoute,
  AdminProtectedRoute,
  AffiliateProtectedRoute,
  PublicOnlyRoute,
  AffiliatePublicRoute,
  TokenRequiredRoute
} from './Components/Protectedroutes/Protectedroutes';
import PartnerDetails from './Components/AdminDashboard/AdminSections/PartnerDetails/PartnerDetails';
import PaymentSuccess from './Components/PaymentSuccess/PaymentSuccess';
import PaymentCancel from './Components/PaymentCancel/PaymentCancel';
import TradingViewUsername from './Components/TradingViewUsername/TradingViewUsername';
import { LanguageProvider } from './Context/LanguageContext';
import Library from './Pages/Library/Library';
import IndicatorDetails from './Pages/IndicatorDetails/IndicatorDetails';
import CookiesPolicy from './Components/CookiesPolicy/CookiesPolicy';
import PrivacyPolicy from './Components/PrivacyPolicy/PrivacyPolicy';
import Disclaimer from './Components/Disclaimer/Disclaimer';
import Support from './Components/Support/Support';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";





const routers = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Public routes (available to everyone)
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'blog', element: <Blog /> },
      { path: 'community', element: <Community /> },
      { path: 'docs', element: <Docs /> },
      { path: 'Pricing', element: <Pricing /> },
      { path: 'affiliates', element: <Affiliates /> },
      {path:'support' , element: <Support/> },
      {
  path: "library",
  element: <Library />
},
{
  path: "library/:id",
  element: <IndicatorDetails />
},
{path:'CookiesPolicy' , element: <CookiesPolicy/>},
{path:'PrivacyPolicy' , element: <PrivacyPolicy/>},
{path:'Disclaimer' , element: <Disclaimer/>},



      
      // 🔥 Public only routes - User/Admin Login & Register (redirect if authenticated)
      {
        path: 'login',
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        )
      },
      {
        path: 'register',
        element: (
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        )
      },

      // 🔥 Affiliate Public only routes (redirect if ANY user is authenticated)
      {
        path: 'affiliatesLogin',
        element: (
          <AffiliatePublicRoute>
            <AffiliatesLogin />
          </AffiliatePublicRoute>
        )
      },
      {
        path: 'affiliatesApply',
        element: (
          <AffiliatePublicRoute>
            <AffiliatesApply />
          </AffiliatePublicRoute>
        )
      },
      
      // Google callback
      { path: 'auth/google/callback', element: <GoogleCallback /> },
      
      // Token required routes (password reset, email verification)
      {
        path: 'password-reset/:token',
        element: (
          
            <NewPassword />
          
        )
      },
      {
        path: 'reset-password',
        element: (
          
            <AffiliateNewPassword />
         
        )
      },
      {
        path: 'verifyAccount',
        element: (
            <VerifyAccount />
        )
      },
      {
        path: 'affiliateVerifyAccount',
        element: (
          
            <AffiliateVerifyAccount />
          
        )
      },
      
      // Public password reset request pages
      { path: 'forgotPassword', element: <ForgotPassword /> },
      { path: 'affiliateForgetPassword', element: <AffiliateForgetPassword /> },
      
      // Success pages
      { path: 'registerSuccess', element: <RegisterSuccess /> },
      { path: 'affiliateApplySuccess', element: <AffiliateApplySuccess /> },
      // { path: 'subscriptionSuccess', element: <SubscriptionSuccess /> },
      // { path: 'subscriptionFailed', element: <SubscriptionFailed /> },
      { path: 'payment-success', element: <PaymentSuccess /> },
      { path: 'payment-cancel', element: <PaymentCancel /> },
      
      // Unverified user page
      { path: 'UnverifiedUsers', element: <UnverifiedUsers /> },
      
      // Protected user routes
      {
        path: 'userDashboard',
        element: (
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        )
      },
      {
        path: 'tradingviewusername',
        element: (
          <UserProtectedRoute>
            <TradingViewUsername />
          </UserProtectedRoute>
        )
      },
      
      // Protected admin routes
      {
        path: 'adminDashboard',
        element: (
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        )
      },
      {
        path: 'admin/partners/:id',
        element: (
          <AdminProtectedRoute>
            <PartnerDetails />
          </AdminProtectedRoute>
        )
      },
      
      // Protected affiliate routes
      {
        path: 'affiliateDashboard',
        element: (
          <AffiliateProtectedRoute>
            <AffiliateDashboard />
          </AffiliateProtectedRoute>
        )
      },
      
      // 404 page
      { path: '*', element: <NotFound /> }
    ]
  }
]);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  // Disable console in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
      console.debug = () => {};
    }
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
      {loading && <LoadingScreen />}
      {!loading && <RouterProvider router={routers} />}
      <ToastContainer position="top-center" autoClose={5000} rtl={document.documentElement.dir === "rtl"} />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;