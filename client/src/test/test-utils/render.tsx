import { render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthContext, AuthContextType } from '../../hooks/useAuth.tsx';
import { BuildProvider } from '../../hooks/BuildContext.tsx';
import { vi } from 'vitest';


/**
 * Custom render function that automatically adds necessary provider wrappers.
 * Starts the auth provider with default values of logged out user.
 *
 * @param {React.ReactNode} ui - The React component to render.
 * @param {Partial<AuthContextType>} authValue - The value to use for the AuthContext.Provider
 * @returns {RenderResult} The result of the render, including utility functions for testing.
 */
export function render(ui: React.ReactNode, authValue?: Partial<AuthContextType>) {

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

  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <MantineProvider theme={theme}>
          <AuthContext.Provider value={defaultAuth}>
            <BuildProvider>
              <BrowserRouter>
                {children}
              </BrowserRouter>
            </BuildProvider>
          </AuthContext.Provider>
        </MantineProvider>
      </GoogleOAuthProvider>
    ),
  });
}