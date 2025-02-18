import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import React from 'react';
import '../styles/login.css';

export default function Login() {
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
          onSuccess={login}
          onError={handleError} />
      </section>
    </div>
  );
}
