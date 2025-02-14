import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import React from 'react';

export default function Login() {
  const {username, loading, login, logout} = useAuth() ?? {};
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
      <p className="error">{errorMessage}</p>
      <h2>Welcome {username ? username : 'Anonymous'}</h2>
      {!username && <GoogleLogin
        onSuccess={login}
        onError={handleError} /> }
      {username && <button onClick={logout}>Logout</button> } 
    </div>
  );
}
