import React from 'react';
import { Outlet } from 'react-router-dom';
import './index.css';
const ErrorPage = React.lazy(() => import('./error-page.jsx'));
const Login = React.lazy(() => import('./components/Login.tsx'));
const Logout = React.lazy(() => import('./components/Logout.tsx'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute.tsx'));
const Profile = React.lazy(() => import('./components/Profile.tsx'));
const Forum = React.lazy(() => import('./components/Forum.tsx'));
const CraftersDen = React.lazy(() => import('./components/mainUI/CraftersDen.jsx'));
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Welcome from './components/Welcome.tsx';
import { ToastContainer, Slide } from 'react-toastify';

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
