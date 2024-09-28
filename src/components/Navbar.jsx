import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import the AccountCircle icon
import '../styles/navbar.css'; // Import the CSS file

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Track the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set to true if user is logged in, false otherwise
    });

    return () => unsubscribe(); // Cleanup the subscription on unmount
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
    <div className="navbar-container"> {/* Container for centering */}
      <nav className="navbar">
        <div className="logo">
          <h1>MyApp</h1>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/services">Analysis</Link>
          <Link to="/contact">Review</Link>
          <Link to="/notes">Notes</Link>
        </div>
        <div className="user-icon">
          <AccountCircleIcon fontSize="large" onClick={handleLogout} /> {/* Use the AccountCircle icon */}
        </div>
        {/* Toggle between Logout and Login buttons */}
        <button onClick={handleLogout}>
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
