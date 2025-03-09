import React from "react";
import { Avatar, Button } from "@mantine/core";
import { useLocation } from "react-router-dom";
import Link from './Navigation/Link';
import { useAuth } from "../hooks/useAuth";
import '../styles/header.css';
import { useBuildUpdate } from "../hooks/BuildContext";

/**
 * Header component that allows users to visit
 * /profile, /den and /forum. Changes based on
 * the current page.
 * @returns {React.ReactNode} Header component
 */
export default function Header() {
  const {avatar, loading} = useAuth() ?? {};
  const location = useLocation();
  const isDen = location.pathname === '/den';

    const { setBuild } = useBuildUpdate();

    if (loading) {
        return <h2>Loading...</h2>;
    }

    const handleDenClick = () => {
        setBuild(undefined);
    }

    return <header id="site-header">
        <Link to='/profile'>
            <Avatar src={avatar} />
        </Link>
        <h2>
            <Link to={isDen ? `/den` : `/forum`} state={{canGoBack: true}}>
                {isDen ? `Crafter's Den` : `Crafter's Forum`}
            </Link>
        </h2>
        <Link 
            to={!isDen ? `/den` : `/forum`}
            state={{canGoBack: true}}
            onClick={handleDenClick}>
            <Button variant="filled">
                {!isDen ? `Den` : `Forum`}
            </Button>
        </Link>
    </header>
}