import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import '../styles/welcome.css';
import placeholder from '../assets/placeholder.png';

/**
 * Welcome page component linking to login page
 * @returns {React.ReactNode} Welcome page
 */
export default function Welcome(): React.ReactNode {
  return <section id="welcome-page">
    <div id="welcome-left">
      <h1>Welcome!</h1>
      <h2>Let&apos;s get started</h2>
      <p>
        Crafter&apos;s Den is a website that allows you create 
        minecraft builds and share them with your friends.
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
        Error reprehenderit quos neque ipsum voluptatum aperiam sed 
        consectetur magnam vero asperiores ipsam, laborum perspiciatis 
        laudantium excepturi dolorum sequi possimus doloribus dicta?
      </p>
      <div className="buttons">
        <Link to="/login">
          <Button variant="filled">
                        Login
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="outline">
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