import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import React from 'react';
import '../styles/login.css';

import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useGoBack from './Navigation/useGoBack.tsx';

export default function Login() {
  const goBack = useGoBack('/');
  const {loading, login} = useAuth() ?? {};
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = (error = 'Error logging in') => {
    setErrorMessage('Error logging in');
    console.error(error);
  };

  if (loading || login === undefined) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="login">
      <section className='login-box'>
        <h2>Login</h2>
        <p className="error">{errorMessage}</p>
        <GoogleLogin
          onSuccess={(creds) => {
            login(creds, goBack);
          }}
          onError={handleError} />
      </section>
    </div>
  );
}
