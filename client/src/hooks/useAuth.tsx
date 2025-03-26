import { CredentialResponse } from '@react-oauth/google';
import { useState, createContext, useContext, useEffect } from 'react';
import {successMessage, errorMessage as errorPopup} from '../utils/notification_utils';
import React from 'react';

type ContextProviderProps = {
    children: React.ReactNode;
};

export type AuthContextType = {
    id: string,
    username: string,
    email: string,
    avatar: string,
    loading: boolean, 
    login: (googleCredentials: CredentialResponse) => void,
    logout: () => void
};

export const AuthContext = createContext<null | AuthContextType>(null);

export const AuthProvider = ({ children }: ContextProviderProps) => {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     *
     */
    async function query() {
      if (loading) {
        if (!username) {
          const resp = await fetch('/api/query');
          if (resp.ok) {
            const data = await resp.json();
            if (data) {
              setId(data.user._id);
              setUsername(data.user.username);
              setEmail(data.user.email);
              setAvatar(data.user.avatar);
            }
          }
        }
        setLoading(false);
      }
    };

    query();
  }, []);

  const login = async (googleData: CredentialResponse) => {
    let data: {user: {_id: string, username: string, email: string, avatar: string}};
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({
          token: googleData.credential
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error('Failed to connect- HTTP status ' + res.status);
      }
      data = await res.json();
      console.log(data);
    } catch (e) {
      console.error(e);
      return;
    }
    setId(data.user._id);
    setUsername(data.user.username);
    setEmail(data.user.email);
    setAvatar(data.user.avatar);
  };

  const logout = async () => {
    try {
      await fetch('/api/logout');
      setId('');
      setUsername('');
      setEmail('');
      setAvatar('');
      successMessage("Successfully logged out");
    } catch (e) {
      errorPopup('Error logging out!');
      console.error(e);
      return;
    }
  };

  const value = { id, username, email, avatar, loading, login, logout };

  return (
  // Using the provider so that ANY component in our application can 
  // use the values that we are sending.
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
