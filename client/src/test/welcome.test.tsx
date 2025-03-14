import { describe, it, expect, afterEach, afterAll, beforeAll } from 'vitest'
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import  { setupServer } from 'msw/node';
import { render, screen } from './test-utils';

import Welcome from "../components/Welcome";
import React from 'react';

const server = setupServer(
  http.get('/api/query', () => {
      return HttpResponse.json({user: '1'});
    }
  )
)

  // If you want to see the DOM structure
  //screen.debug();
describe('Welcome', () => {

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  })

  afterAll(() => server.close());

  it('renders login and sign up when logged out', async () => {
    render(<Welcome />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    const signUpButton = screen.getByRole('button', { name: /sign up/i });


    expect(loginButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();

  });
});