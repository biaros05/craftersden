import React from "react";
import Link from "./Navigation/Link";
import { Button } from "@mantine/core";
import '../styles/welcome.css'
import placeholder from '../assets/placeholder.png';

export default function Welcome(): React.ReactNode {
    return <section id="welcome-page">
        <div id="welcome-left">
            <h1>Welcome!</h1>
            <h2>Let's get started</h2>
            <p>
                Crafter's Den is a website that allows you create minecraft builds and share them with your friends.
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error reprehenderit quos neque ipsum voluptatum aperiam sed consectetur magnam vero asperiores ipsam, laborum perspiciatis laudantium excepturi dolorum sequi possimus doloribus dicta?
            </p>
            <div className="buttons">
                <Link to='/login' state={{canGoBack: false}}>
                    <Button variant='filled'>
                        Login
                    </Button>
                </Link>
                <Link to='/login' state={{canGoBack: false}}>
                    <Button variant='outline'>
                        Sign up
          </Button>
        </Link>
      </div>
    </div>
    <div id="welcome-right">
      <img src={placeholder} alt="placeholder" />
    </div>
  </section>;
}