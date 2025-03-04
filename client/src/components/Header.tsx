import React from "react";
import { Avatar, Button } from "@mantine/core";
import { useLocation } from "react-router-dom";
import Link from "./Navigation/Link";

import { useAuth } from "../hooks/useAuth";
import '../styles/header.css';

export default function Header() {
    const {avatar, loading} = useAuth() ?? {};
    const location = useLocation();
    const isDen = location.pathname === '/den';

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return <header id="site-header">
        <Link to='/profile' state={{canGoBack: true}}>
            <Avatar src={avatar} />
        </Link>
        <h2>
            <Link to={isDen ? `/den` : `/forum`} state={{canGoBack: true}} >
                {isDen ? `Crafter's Den` : `Crafter's Forum`}
            </Link>
        </h2>
        <Link to={!isDen ? `/den` : `/forum`}>
            <Button variant="filled">
                {!isDen ? `Den` : `Forum`}
            </Button>
        </Link>
    </header>
}