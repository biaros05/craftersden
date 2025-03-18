import { describe, it, expect, afterEach, afterAll, beforeAll, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import  { setupServer } from 'msw/node';
import {renderWithoutWrapper, screen, userEvent, renderHook, act } from './test-utils';
import React from 'react';

import App from '../App.tsx';

const serverWhileLoggedIn = setupServer(
  http.get('/api/query', () => {
      return HttpResponse.json({user: '1'});
    }
  )
)
describe ('App navigation logged in', () => {

  beforeAll(() => serverWhileLoggedIn.listen());
  
  afterEach(() => {
    serverWhileLoggedIn.resetHandlers();
  })
  
  afterAll(() => serverWhileLoggedIn.close());

  it ('starts at Welcome page', async () => {
    renderWithoutWrapper(<App />);

    const location = screen.getByTestId('location-display');
    expect(location).toHaveTextContent('/');
  })

})