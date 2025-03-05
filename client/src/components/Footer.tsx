import React from "react";
import Link from "./Navigation/Link";
import '../styles/footer.css'

export default function Footer(): React.ReactNode {
    return <footer className="site-footer">
        <ul className="footer-links">
            <h3>Site</h3>
            <li><Link to='/' state={{canGoBack: true}}>Welcome</Link></li>
            <li><Link to='/den' state={{canGoBack: true}}>Den</Link></li>
            <li><Link to='/forum' state={{canGoBack: true}}>Forum</Link></li>
        </ul>
        <ul className="footer-links">
            <h3>Account</h3>
            <li><Link to='/profile' state={{canGoBack: true}}>Profile</Link></li>
            <li><Link to='/login' state={{canGoBack: true}}>Login</Link></li>
            <li><Link to='/logout' state={{canGoBack: true}}>Logout</Link></li>
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