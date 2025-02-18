import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Logout() {
    const {logout} = useAuth() ?? {};

    if (logout) {
        logout();
    }

    return <Navigate to={'/'}/>
}