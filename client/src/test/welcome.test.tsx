import { describe, it, expect, afterEach, beforeEach, afterAll, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import  { setupServer } from 'msw/node';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../hooks/useAuth.tsx';
import { BuildProvider } from '../hooks/BuildContext.tsx';


import Welcome from "../components/Welcome";
import React from 'react';

const ProviderWrapper = ({children}) => {
  return (
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <MantineProvider>
              <AuthProvider >
                <BuildProvider>
                  <BrowserRouter>
                    {children}
                  </BrowserRouter>
                </BuildProvider>
              </AuthProvider>
            </MantineProvider>
          </GoogleOAuthProvider>
  )

}

const server = setupServer(
  http.get('/api/query', () => {
      return HttpResponse.json({user: '1'});
    }
  )
)

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  })),
});

  // If you want to see the DOM structure
  //screen.debug();

  // If you want to see the DOM structure
  //screen.debug();

describe('Welcome', () => {

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  })

  afterAll(() => server.close());

  it('renders login and sign up when logged out', async () => {
    render(<Welcome />, {wrapper: ProviderWrapper});

    const loginButton = screen.getByText('Login');


    expect(loginButton).toBeInTheDocument();

  });
});