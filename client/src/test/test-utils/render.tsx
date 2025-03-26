import { RenderResult, render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import React from 'react';
import { BrowserRouter, createMemoryRouter, RouterProvider, Router } from 'react-router-dom';
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
 * Render a React component with necessary provider wrappers for testing with 
 * testing-library.
 * 
 * This function ensures that the component has access to all required contexts.
 * Additionnaly, it provides an option to render with routing support:
 * - If `useRouter` is `true`, a RouterProvider is used, which also means the `<App/>` component is rendered
 * regardless of ui provided
 * - If `useRouter` is `false`, a BrowserRouter is used, which is needed for context, but will not allow routing,
 * 
 * Starts the auth provider with default values of logged out user.
 * @param {React.ReactNode} ui - The React component to render.
 * @param {object} RenderOptions - The options object.
 * @param {boolean} RenderOptions.useRouter - Whether to use a router or not. Is false by default
 * @param {string} RenderOptions.initialRoute - The initial route to use if `useRouter` is set to true. Is / by default.
 * @param {Partial<AuthContextType>} RenderOptions.authValue - The value to use for the auth context. Has empty values for all fields by default.
 * @returns {{renderResult: RenderResult;router: any;}} The result of the render and the router if `useRouter` was set to true.
 */
export function render(
  ui: React.ReactNode,
  { useRouter = false, initialRoute = '/', authValue = {} }: RenderOptions = {}
): { renderResult: RenderResult; router: typeof Router; } {

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
  const router = useRouter
  ? createMemoryRouter(routesConfig, { initialEntries: [initialRoute]})
  : null;

  const renderResult =  testingLibraryRender(
  <AuthContext.Provider value={defaultAuth}>
    <GoogleOAuthProvider clientId="test">
      <MantineProvider theme={theme}>
        <BuildProvider>
          {useRouter ? (
            <RouterProvider router={router!} />
          ) : (
            <BrowserRouter>{ui}</BrowserRouter>
          )}
        </BuildProvider>
      </MantineProvider>
    </GoogleOAuthProvider>
  </AuthContext.Provider>
  );
  return {renderResult, router};
}