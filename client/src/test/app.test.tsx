import { describe, it, expect, afterEach, afterAll, beforeAll} from 'vitest'
import '@testing-library/jest-dom';
import  { setupServer } from 'msw/node';
import {screen, userEvent, within} from './test-utils';
import React from 'react';

import App from '../App.tsx';
import { handlers } from './test-utils/mocks/handlers.ts';
import { render } from './test-utils/render';

const server = setupServer(...handlers);

const loggedInUser = {
  id: '1',
  username: 'test',
  email: 'test@test.com',
  avatar: 'test',
  loading: false,
}

describe ('App navigation logged in', () => {

  beforeAll(() => server.listen());
  
  afterEach(() => {
    server.resetHandlers();
  })
  
  afterAll(() => server.close());

  it('starts at Welcome page', async () => {
    const {router} = render(<App />, { useRouter: true });

    expect(router?.state.location.pathname).toBe('/');
  });

  it('navigate to profile page from header', async () => {
    const user = userEvent.setup();
    const {router} = render(<App />, { 
      useRouter: true,
      authValue: loggedInUser
    });


    await user.click(screen.getByRole('link', { name: /profile/i }))

    expect(router?.state.location.pathname).toBe('/profile');
  });

  it('navigate to den from header', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
      authValue: loggedInUser
    });

    const header = screen.getByRole('banner');
    const headerWithin = within(header);
    
    await user.click(headerWithin.getByRole('link', { name: /den/i }));
    expect(router?.state.location.pathname).toBe('/den');
  });

  it('navigate to forum from den header', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
      initialRoute: '/den',
      authValue: loggedInUser
    });
    const header = screen.getByRole('banner');
    const headerWithin = within(header);
    
    await user.click(headerWithin.getByRole('link', { name: /forum/i }));

    expect(router?.state.location.pathname).toBe('/forum');
  });

  it('navigate to den from profile header', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
      initialRoute: '/den',
      authValue: loggedInUser
    });
    const header = screen.getByRole('banner');
    const headerWithin = within(header);
    
    await user.click(headerWithin.getByRole('link', { name: /den/i }));

    expect(router?.state.location.pathname).toBe('/den');
  });

  it('navigate to profile from footer', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
      authValue: loggedInUser
    });
    const footer = screen.getByRole('contentinfo');
    const footerWithin = within(footer);

    await user.click(footerWithin.getByRole('link', { name : /profile/i}));

    expect(router?.state.location.pathname).toBe('/profile');
  });

  it('navigate to welcome from footer', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
      authValue: loggedInUser
    });
    const footer = screen.getByRole('contentinfo');
    const footerWithin = within(footer);

    await user.click(footerWithin.getByRole('link', { name : /welcome/i}));

    expect(router?.state.location.pathname).toBe('/');
  });

  it('navigate to den from footer', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
      authValue: loggedInUser
    });
    const footer = screen.getByRole('contentinfo');
    const footerWithin = within(footer);

    await user.click(footerWithin.getByRole('link', { name : /den/i}));

    expect(router?.state.location.pathname).toBe('/den');
  });

  it('navigate to forum from footer', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
      authValue: loggedInUser
    });
    const footer = screen.getByRole('contentinfo');
    const footerWithin = within(footer);

    await user.click(footerWithin.getByRole('link', { name : /forum/i}));

    expect(router?.state.location.pathname).toBe('/forum');
  });

  it('navigate to login from footer does not work while logged in', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
      authValue: loggedInUser
    });
    const footer = screen.getByRole('contentinfo');
    const footerWithin = within(footer);

    await user.click(footerWithin.getByRole('link', { name : /login/i}));

    expect(router?.state.location.pathname).toBe('/');
  });

  it('navigate to logout from footer works while logged in', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
      authValue: loggedInUser
    });
    const footer = screen.getByRole('contentinfo');
    const footerWithin = within(footer);

    await user.click(footerWithin.getByRole('link', { name : /logout/i}));

    expect(router?.state.location.pathname).toBe('/');
  });
});

describe ('App navigation logged out', () => {
  
  beforeAll(() => server.listen());
  
  afterEach(() => {
    server.resetHandlers();
  })
  
  afterAll(() => server.close());

  it('navigate to profile from header does not work', async ()=> {
    const user = userEvent.setup();
    const {router} = render(<App />, { 
      useRouter: true,
    });


    await user.click(screen.getByRole('link', { name: /profile/i }))

    const errorAlert = screen.getByRole('alert');

    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/please log in to access this page!/i);
    expect(router?.state.location.pathname).toBe('/');
  });

  it('navigate to den from header works', async ()=> {
    const user = userEvent.setup();
    const {router} = render(<App />, { 
      useRouter: true,
    });


    await user.click(screen.getByRole('link', { name: /den/i }))

    expect(router?.state.location.pathname).toBe('/den');
  });

  it('navigate to profile from den header does not work', async ()=> {
    const user = userEvent.setup();
    const {router} = render(<App />, { 
      useRouter: true,
      initialRoute: '/den'
    });

    await user.click(screen.getByRole('link', { name: /profile/i }))

    const errorAlert = screen.getByRole('alert');

    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/please log in to access this page!/i);
    expect(router?.state.location.pathname).toBe('/');
  });

  it('navigate to forum from den header does not work', async ()=> {
    const user = userEvent.setup();
    const {router} = render(<App />, { 
      useRouter: true,
      initialRoute: '/den'
    });


    await user.click(screen.getByRole('link', { name: /forum/i }))

    const errorAlert = screen.getByRole('alert');

    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/please log in to access this page!/i);
    expect(router?.state.location.pathname).toBe('/');
  });

  it('navigate to forum from footer does not work', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
    });
    const footer = screen.getByRole('contentinfo');
    const footerWithin = within(footer);

    await user.click(footerWithin.getByRole('link', { name : /forum/i}));

    const errorAlert = screen.getByRole('alert');

    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/please log in to access this page!/i);
    expect(router?.state.location.pathname).toBe('/');
  });

  it('navigate to profile from footer does not work', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
    });
    const footer = screen.getByRole('contentinfo');
    const footerWithin = within(footer);

    await user.click(footerWithin.getByRole('link', { name : /profile/i}));
    
    const errorAlert = screen.getByRole('alert');

    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/please log in to access this page!/i);
    expect(router?.state.location.pathname).toBe('/');
  });

  it('navigate to den from footer works', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
    });
    const footer = screen.getByRole('contentinfo');
    const footerWithin = within(footer);

    await user.click(footerWithin.getByRole('link', { name : /den/i}));
    
    expect(router?.state.location.pathname).toBe('/den');
  });


  it('navigate to den from footer works', async () => {
    const user = userEvent.setup();
    const {router} = render(<App/>, {
      useRouter: true,
    });
    const footer = screen.getByRole('contentinfo');
    const footerWithin = within(footer);

    await user.click(footerWithin.getByRole('link', { name : /login/i}));
    
    expect(router?.state.location.pathname).toBe('/login');
  });
});