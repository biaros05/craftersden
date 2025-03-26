import './index.css';
import { Outlet } from 'react-router-dom';
import ErrorPage from './error-page.jsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Welcome from './components/Welcome.tsx';
import Login from './components/Login.tsx';
import Logout from './components/Logout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Profile from './components/Profile.tsx';
import Forum from './components/Forum.tsx';
import CraftersDen from './components/mainUI/CraftersDen.js';
import { ToastContainer, Slide } from 'react-toastify';
import React from 'react';

/**
 * Main layout of the app. Renders header
 * and Footer with reactrouter children in
 * between
 * @returns {React.ReactNode} Page parent
 */
function Main(): React.ReactNode {
  return <>
    <Header />
    <Outlet />
    <Footer />
    <ToastContainer
    position="bottom-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
    transition={Slide}
    />
  </>
}

export const routesConfig = [
  {
    path: '/',
    element: <Main/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '',
        element: <Welcome />,
      },
      {
        path: 'login',
        element: <ProtectedRoute authed={false} ><Login /></ProtectedRoute>
      },
      {
        path: 'logout',
        element: <ProtectedRoute authed={true} ><Logout /></ProtectedRoute>
      },
      {
        path: 'forum',
        element: <ProtectedRoute  authed={true} ><Forum /></ProtectedRoute>
      },
      {
        path: 'profile',
        element: <ProtectedRoute authed={true} ><Profile /></ProtectedRoute>
      },
      {
        path: 'den',
        element: <CraftersDen />
      }
    ]
  }
];
