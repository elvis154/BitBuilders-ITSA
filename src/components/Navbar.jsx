import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../styles/navbar.css';
import logo from '../assets/logo.jpeg'; // Import the logo image

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      if (isLoggedIn) {
        await signOut(auth);
        navigate("/login");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-image" /> {/* Replace text with logo */}
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/services">Analysis</Link>
          <Link to="/contact">Review</Link>
          <Link to="/notes">Notes</Link>
          <Link to="/class">Class</Link>
        </div>
        <div className="user-icon">
          <AccountCircleIcon fontSize="large" onClick={handleLogout} />
        </div>
        <button onClick={handleLogout}>
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </nav>
    </div>
  );
};

export default Navbar;