import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { StrictMode } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import ErrorPage from './error-page.jsx';
import CraftersDen from './components/CraftersDen.jsx';

import '@mantine/core/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';
import React from 'react';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <ErrorPage/>
  },
  {
    path: '/den',
    element: <CraftersDen/>,
    errorElement: <ErrorPage/>
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