import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import React from 'react';
import '../styles/login.css';
import {successMessage, errorMessage as errorPopup} from '../utils/notification_utils';


/**
 * @returns {React.ReactNode} - Login component
 */
export default function Login(): React.ReactNode  {
  const {loading, login} = useAuth() ?? {};
  const [errorMessage, setErrorMessage] = useState('');

  const handleError = (error = 'Error logging in') => {
    setErrorMessage('Error logging in');
    errorPopup('Error logging in');
    console.error(error);
  };

  if (loading || login === undefined) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="login">
      <section className="login-box">
        <h2>Login</h2>
        <p className="error">{errorMessage}</p>
        <GoogleLogin
          onSuccess={(creds) => {
            login(creds);
            successMessage("Successfully logged in!");
            // goBack();
          }}
          onError={handleError} />
      </section>
    </div>
  );
}
