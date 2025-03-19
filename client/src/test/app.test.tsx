import { describe, it, expect, afterEach, afterAll, beforeAll} from 'vitest'
import '@testing-library/jest-dom';
import  { setupServer } from 'msw/node';
import {screen, userEvent} from './test-utils';
import React from 'react';

import App from '../App.tsx';
import { handlers } from './test-utils/mocks/handlers.ts';
import { render } from './test-utils/render';

const serverWhileLoggedIn = setupServer(...handlers);

const loggedInUser = {
  id: '1',
  username: 'test',
  email: 'test@test.com',
  avatar: 'test',
  loading: false,
}

describe ('App navigation logged in', () => {

  beforeAll(() => serverWhileLoggedIn.listen());
  
  afterEach(() => {
    serverWhileLoggedIn.resetHandlers();
  })
  
  afterAll(() => serverWhileLoggedIn.close());

  it('starts at Welcome page', async () => {
    const {router} = render(<App />, { useRouter: true });

    expect(router?.state.location.pathname).toBe('/');
  });

  it('navigate to profile page while logged in', async () => {
    const user = userEvent.setup();
    const {router} = render(<App />, { 
      useRouter: true,
      authValue: loggedInUser
    });


    await user.click(screen.getByRole('link', { name: /profile/i }))

    expect(router?.state.location.pathname).toBe('/profile');
  });

})