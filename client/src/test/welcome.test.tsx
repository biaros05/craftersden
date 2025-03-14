import { describe, it, expect, afterEach, beforeEach, afterAll, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import  { setupServer } from 'msw/node';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';

import Welcome from "../components/Welcome";
import React from 'react';

// const server = setupServer(
//   http.get('/api/query', () => {
//       return HttpResponse.json({user: '1'});
//     }
//   )
// )

  // If you want to see the DOM structure
  //screen.debug();

describe('Welcome', () => {

  // beforeAll(() => server.listen());

  // afterEach(() => {
  //   server.resetHandlers();
  // })

  // afterAll(() => server.close());

  it('renders login and sign up when logged out', async () => {
    render(<Welcome />, {wrapper: BrowserRouter});

    const loginButton = screen.getByText('Login');
    const signUpButton = screen.getByText('SignUp');


    expect(loginButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();

  });
});