import React, { Suspense } from 'react';
import { StrictMode } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './hooks/useAuth.tsx';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import { BuildProvider } from './hooks/BuildContext.tsx';
import '@mantine/core/styles.css';
import { MantineProvider} from '@mantine/core';
import { theme } from './theme';
import { routesConfig } from './routesconfig.tsx';
const AdaptiveLoad = React.lazy(() => import('./components/Loader/AdaptiveLoad.tsx'));


const router = createBrowserRouter(routesConfig);

/**
 * The main application component
 * @returns {React.ReactNode} The main application component with all providers.
 */
export default function App(): React.ReactNode {
  return (
    <StrictMode>
      <AuthProvider >
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <MantineProvider theme={theme}>
            <AuthProvider >
              <BuildProvider>
                <Suspense fallback={<AdaptiveLoad />}>
                  <RouterProvider router={router} />
                </Suspense>
              </BuildProvider>
            </AuthProvider>
          </MantineProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </StrictMode>
  );
}