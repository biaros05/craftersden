import { describe, it, expect, afterEach, afterAll, beforeAll, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import  { setupServer } from 'msw/node';
import { render, screen, userEvent, renderHook, act } from './test-utils';


import App from '../main.tsx';
import React from 'react';


describe ('App navigation', () => {

  beforeEach(() => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  })

  it ('starts at Welcome page', async () => {
    render(<App />);

    const location = screen.getByTestId('location-display');
    expect(location).toHaveTextContent('/');
  })
})