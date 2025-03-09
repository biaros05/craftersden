import React from "react";
import {errorMessage} from '../utils/notification_utils';
import { useAuth } from "./../hooks/useAuth";
import useGoBack from './Navigation/useGoBack';
import {useLocation} from 'react-router-dom';

/**
 * Checks if a user is logged in or not and if they should be. If they
 * aren't the user is redirected to the given route.
 * @param {object} props - React props
 * @param {boolean} props.authed Whether the user must be signed in to access the component
 * @param {React.ReactNode} props.children Component to protect
 * @returns {React.ReactNode} Renders the component if the user is allowed to view the route
 */
export default function ProtectedRoute({ authed, children }: 
  {authed: boolean, children: React.ReactNode}
): React.ReactNode {
  const { username, loading } = useAuth() ?? {};
  const location = useLocation();

  const goBack = useGoBack('/');

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (username && !authed || !username && authed) {
    if (location.pathname !== '/logout' && location.pathname !== '/login') {
      errorMessage("Please log in to access this page!");
    }
    goBack();
  }

  return children;
};
