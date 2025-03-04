import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Logout page that logs out the user
 * and redirects them to /
 * @returns {React.ReactNode} redirects user to /
 */
export default function Logout(): React.ReactNode {
  const {logout} = useAuth() ?? {};

  if (logout) {
    logout();
  }

  return <Navigate to={'/'}/>;
}