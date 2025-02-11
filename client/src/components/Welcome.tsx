import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import '../styles/welcome.css'
import placeholder from '../assets/placeholder.png';

export default function Welcome() {
    return <section id="welcome-page">
        <div id="welcome-left">
            <h1>Welcome!</h1>
            <h2>Let's get started</h2>
            <p>
                Crafter's Den is a website that allows you create minecraft builds and share them with your friends.
            </p>
            <div className="buttons">
                <Link to='/login'>
                    <Button variant='filled'>
                        Login
                    </Button>
                </Link>
                <Link to='/login'>
                    <Button variant='outline'>
                        Sign up
                    </Button>
                </Link>
            </div>
        </div>
        <div id="welcome-right">
            <img src={placeholder} alt="placeholder" />
        </div>
    </section>
}