import { render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../../hooks/useAuth.tsx';
import { BuildProvider } from '../../hooks/BuildContext.tsx';

/**
 * Custom render function that automatically adds necessary provider wrappers.
 *
 * @param {React.ReactNode} ui - The React component to render.
 * @returns {RenderResult} The result of the render, including utility functions for testing.
 */
export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <MantineProvider theme={theme}>
          <AuthProvider >
            <BuildProvider>
              <BrowserRouter>
                {children}
              </BrowserRouter>
            </BuildProvider>
          </AuthProvider>
        </MantineProvider>
      </GoogleOAuthProvider>
    ),
  });
}