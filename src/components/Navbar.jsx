import React from 'react';
import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li className="nav-item"><Link to="/">Home</Link></li>
        <li className="nav-item active"><Link to="/classes">Classes</Link></li>
        <li className="nav-item"><Link to="/">Teachers</Link></li>
        <li className="nav-item"><Link to="/">Students</Link></li>
        <li className="nav-item"><Link to="/">Calendar</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;