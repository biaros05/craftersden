import { describe, it, expect, afterEach, afterAll, beforeAll } from 'vitest'
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import  { setupServer } from 'msw/node';
import { render, screen} from './test-utils';

import Welcome from "../components/Welcome";
import React from 'react';

const server = setupServer(
  http.get('/api/query', () => {
      return HttpResponse.json({user: '1'});
    }
  )
)

const loggedInUser = {
  id: '1',
  username: 'test',
  email: 'test@test.com',
  avatar: 'test',
  loading: false,
}

  // If you want to see the DOM structure
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

  it('displays log out when logged in', async () => {

    render(<Welcome />, { authValue: loggedInUser });

    const signOutButton = screen.getByRole('button', { name: /logout/i });
    expect(signOutButton).toBeInTheDocument();
  });

  it('displays image', () => {
    render(<Welcome/>);

    const image = screen.getByRole('img');

    expect(image).toBeInTheDocument();
  })

  it('displays welcome message', async () => {
    render(<Welcome/>)

    const welcome = await screen.findByRole('heading', {level: 1});
    const subwelcome = await screen.findByRole('heading', {level: 2});

    expect(welcome).toBeInTheDocument();
    expect(subwelcome).toBeInTheDocument();
  });
});