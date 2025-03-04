import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './../hooks/useAuth';

/**
 * Checks if a user is logged in or not and if they should be. If they
 * aren't the user is redirected to the given route.
 * @param {object} props - React props
 * @param {boolean} props.authed Whether the user must be signed in to access the component
 * @param {string} props.to Redirection url if the user isn't allowed to view the content
 * @param {React.ReactNode} props.children Component to protect
 * @returns {React.ReactNode} Renders the component if the user is allowed to view the route
 */
export default function ProtectedRoute(
  { authed, to, children }: 
  {authed: boolean, to: string, children: React.ReactNode}
): React.ReactNode {
  const { username, loading } = useAuth() ?? {};

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (username && !authed || !username && authed) {
    return <Navigate to={to} />;
  } 
  
  return children;
};
