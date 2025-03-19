import { RenderResult, render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import React from 'react';
import { BrowserRouter, createBrowserRouter, createMemoryRouter, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthContext, AuthContextType } from '../../hooks/useAuth.tsx';
import { BuildProvider } from '../../hooks/BuildContext.tsx';
import { vi } from 'vitest';
import { routesConfig } from '../../routesconfig.tsx';

type RenderOptions = {
  useRouter?: boolean, 
  initialRoute?: string, 
  authValue?: Partial<AuthContextType>
}

/**
 * Custom render function that automatically adds necessary provider wrappers. Able to render singular 
 * component or router.
 * 
 * 
 * Starts the auth provider with default values of logged out user.
 * @param {React.ReactNode} ui - The React component to render.
 * @param {boolean} useRouter - Whether to use a router for rendering
 * @param {string} initialRoute - The initialRoute to use if is useRouter is true
 * @param {Partial<AuthContextType>} authValue - The value to use for the AuthContext.Provider
 * @returns {RenderResult} The result of the render, including utility functions for testing.
 */
export function render(
  ui: React.ReactNode,
  { useRouter = false, initialRoute = '/', authValue = {} }: RenderOptions = {}
): RenderResult {

  const defaultAuth = {
    id: '',
    username: '',
    email: '',
    avatar: '',
    loading: true,
    login: () => vi.fn(),
    logout: () => vi.fn(),
    ...authValue,
  }
  const router = createMemoryRouter(routesConfig, {
    initialEntries: [initialRoute]
  });

  return testingLibraryRender(
  useRouter ? <RouterProvider router={router}/>: <>{ui}</>, 
  {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <MantineProvider theme={theme}>
          <AuthContext.Provider value={defaultAuth}>
            <BuildProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </BuildProvider>
          </AuthContext.Provider>
        </MantineProvider>
      </GoogleOAuthProvider>
    ),
  });
}