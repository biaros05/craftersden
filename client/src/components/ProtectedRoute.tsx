import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./../hooks/useAuth";

export default function ProtectedRoute({ authed, to, children }: {authed: boolean, to: string, children: React.ReactNode}) {
  const { username } = useAuth() ?? {};

  if (username && !authed || !username && authed) {
    return <Navigate to={to} />;
  } 
  
  return children;
};
