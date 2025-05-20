import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: "Home", path: "/" },
    { name: "Classes", path: "/classes" },
    { name: "Teachers", path: "/teachers" },
    { name: "Students", path: "/students" },
    { name: "Calendar", path: "/calendar" },
  ];

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link.path} className={`nav-item ${currentPath === link.path ? "active" : ""}`}>
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
