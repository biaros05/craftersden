import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { StrictMode } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from 'react-router-dom';
import ErrorPage from './error-page.jsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Welcome from './components/Welcome.tsx';

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
      <MantineProvider theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>
    </StrictMode>
  );