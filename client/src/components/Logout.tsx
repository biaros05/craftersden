import React from "react";
import Navigate from './Navigation/Navigate';
import { useAuth } from "../hooks/useAuth";
import { useBuildUpdate } from "../hooks/BuildContext";

/**
 * Logout page that logs out the user
 * and redirects them to /
 * @returns {React.ReactNode} redirects user to /
 */
export default function Logout(): React.ReactNode {
  const {logout} = useAuth() ?? {};
  const { setBuild } = useBuildUpdate();

  if (logout) {
    logout();
    setBuild(null);
  }

  return <Navigate to={'/'}/>;
}