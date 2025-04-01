import React from "react";
import Link from "./Navigation/Link";
import '../styles/welcome.css';
import { useAuth } from '../hooks/useAuth';
import placeholder from '../assets/placeholder.png';
import MinecraftButton from './Custom/MinecraftButton';

/**
 * @returns {React.ReactNode} - Welcome component
 */
export default function Welcome(): React.ReactNode {
  const {email} = useAuth() ?? {};

    return <section id="welcome-page">
        <div id="welcome-left">
            <h1>Welcome!</h1>
            <h2>Let's get started</h2>
            <p>
                Crafter's Den is a website that allows you create minecraft builds and share them with your friends.
                Head over to the Den to start building using any block in minecraft, or, if you need inspiration, 
                head over to the forum to see what the Minecraft community's builders have in store for you.
            </p>
            <div className="buttons">
                {!email && <Link to='/login' state={{canGoBack: false}}>
                <MinecraftButton>Login</MinecraftButton>
                </Link>}
                {!email ? 
                <Link to='/login' state={{canGoBack: false}}>
                    <MinecraftButton>Sign Up</MinecraftButton>
                </Link> :
                <Link to='/logout' state={{canGoBack: false}}>
                <MinecraftButton>Logout</MinecraftButton>
            </Link>
                }
            </div>
    </div>
    <div id="welcome-right">
        
      <img src={placeholder} alt="placeholder" />
    </div>
  </section>;
}