import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Avatar } from "@mantine/core";
import '../styles/profile.css';

export default function Profile() {
    const {username, avatar} = useAuth() ?? {};

    return <div className="container">
        <h2>{username}</h2>
        <Avatar src={avatar} alt="profile picture" />
    </div>
}