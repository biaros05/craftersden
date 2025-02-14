import { CredentialResponse } from '@react-oauth/google';
import { useState, createContext, useContext } from 'react';
import React from 'react';

type ContextProviderProps = {
    children: React.ReactNode;
};

type AuthContextType = {
    username: string,
    email: string,
    avatar: string,
    loading: boolean, 
    login: (googleCredentials: CredentialResponse) => void,
    logout: () => void
};

const AuthContext = createContext<null | AuthContextType>(null);

export const AuthProvider = ({ children }: ContextProviderProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  (async function query() {
    if (loading) {
      if (!username) {
        const resp = await fetch('/api/query');
        if (resp.ok) {
          const data = await resp.json();
          if (data) {
            setUsername(data.user.username);
            setEmail(data.user.email);
            setAvatar(data.user.avatar);
          }
        }
      }
      setLoading(false);
    }
  })();

  const login = async (googleData: CredentialResponse) => {
    let data: {user: {username: string, email: string, avatar: string}};
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
    } catch (e) {
      console.error(e);
      return;
    }
    setUsername(data.user.username);
    setEmail(data.user.email);
    setAvatar(data.user.avatar);
  };

  const logout = async () => {
    await fetch('/api/logout');
    setUsername('');
    setEmail('');
    setAvatar('');
  };

  const value = { username, email, avatar, loading, login, logout };

  return (
  // Using the provider so that ANY component in our application can 
  // use the values that we are sending.
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
