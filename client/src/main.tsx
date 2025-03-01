import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { StrictMode } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './hooks/useAuth.tsx';
import ErrorPage from './error-page.jsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Welcome from './components/Welcome.tsx';
import Login from './components/Login.tsx';
import Logout from './components/Logout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Profile from './components/Profile.tsx';
import Forum from './components/Forum.tsx';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import CraftersDen from './components/mainUI/CraftersDen.jsx';
import { ToastContainer, Slide } from 'react-toastify';
import '@mantine/core/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';
import React from 'react';

function Main() {
  return <>
    <Header />
    <Outlet />
    <Footer />
  </>
}

const router = createBrowserRouter([
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
        element: <ProtectedRoute to={'/'} authed={false} ><Login /></ProtectedRoute>
      },
      {
        path: 'logout',
        element: <ProtectedRoute to={'/'} authed={true} ><Logout /></ProtectedRoute>
      },
      {
        path: 'forum',
        element: <ProtectedRoute to={'/forum'} authed={true} ><Forum /></ProtectedRoute>
      },
      {
        path: 'profile',
        element: <ProtectedRoute to={'/login'} authed={true} ><Profile /></ProtectedRoute>
      },
      {
        path: 'den',
        element: <CraftersDen/>
      }
    ]
  }
]);

const theme = createTheme({
  primaryColor: 'green',
  primaryShade: 7,
});

createRoot(document.getElementById('root')!!).
  render(
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <MantineProvider theme={theme}>
          <AuthProvider >
            <RouterProvider router={router} />
          </AuthProvider>
        </MantineProvider>
      </GoogleOAuthProvider>
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
    </StrictMode>
  );