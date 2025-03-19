import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom';
import { render } from './test-utils';

import Logout from '../components/Logout';
import React from 'react';


describe('Logout', () => {
  it ('logs out the user', async ()=> {

    const mockLogout = vi.fn();

    //override logout of AuthProvider
    render(<Logout />, { authValue: {logout: mockLogout}});

    expect(mockLogout).toHaveBeenCalled();
  })
  
  it ('clears the build', async ()=> {
    
  });
});