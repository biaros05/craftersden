import React from "react";
import { Link } from "react-router-dom";
import '../styles/footer.css'

export default function Footer() {
    return <footer className="site-footer">
        <ul className="footer-links">
            <h3>Site</h3>
            <li><Link to='/'>Welcome</Link></li>
            <li><Link to='/den'>Den</Link></li>
            <li><Link to='/forum'>Forum</Link></li>
        </ul>
        <ul className="footer-links">
            <h3>Account</h3>
            <li><Link to='/profile'>Profile</Link></li>
            <li><Link to='/login'>Login</Link></li>
            <li><Link to='/logout'>Logout</Link></li>
        </ul>
        <ul className="footer-copyright">
            <h3>Copyright</h3>
            <li>&copy; 2025</li>
        </ul>
        <ul>
            <h3>Developers</h3>
            <li>Amy Nguyen</li>
            <li>Axel Brochu</li>
            <li>Bianca Rossetti</li>
            <li>Marin Melentii</li>
        </ul>
    </footer>;
}