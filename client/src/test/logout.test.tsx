import { describe, it, expect, afterEach, afterAll, beforeAll, vi } from 'vitest'
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import  { setupServer } from 'msw/node';
import { render, screen, userEvent, renderHook, act } from './test-utils';
import { useAuth } from '../hooks/useAuth';

import Logout from '../components/Logout';
import React from 'react';


describe('Logout', () => {
  it ('logs out the user', async ()=> {

    const mockLogout = vi.fn();

    //override logout of AuthProvider
    render(<Logout />, {logout: mockLogout});

    expect(mockLogout).toHaveBeenCalled();
  })
  
  it ('clears the build', async ()=> {
    
  });
});