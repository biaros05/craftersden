import { describe, it, expect, afterEach, afterAll, beforeAll, vi } from 'vitest'
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import  { setupServer } from 'msw/node';
import { render, screen, userEvent, renderHook, act } from './test-utils';
import { useAuth } from '../hooks/useAuth';

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

  it('displays sign out when logged in', async () => {

    render(<Welcome />, loggedInUser);

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
  });

  it('displays image', () => {
    render(<Welcome/>);

    const image = screen.getByRole('img');

    expect(image).toBeInTheDocument();
  })

  it('displays welcome message', () => {
    render(<Welcome/>)

    const welcome = screen.getByRole('heading', {level: 1});
    const subwelcome = screen.getByRole('heading', {level: 2});

    expect(welcome).toBeInTheDocument();
    expect(subwelcome).toBeInTheDocument();
  });
});