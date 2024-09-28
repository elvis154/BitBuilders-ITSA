import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase"; // Firestore instance import
import "../styles/login.css"; // Updated CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student"); // State for dropdown role
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch or update user details in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("User details:", userDoc.data());
      } else {
        // If the user does not exist, create a new document
        await setDoc(doc(db, "users", user.uid), { email, role });
        console.log("New user document created.");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Fetch or update user details in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("User details:", userDoc.data());
      } else {
        // Create a new document with the role
        await setDoc(doc(db, "users", user.uid), { email: user.email, role });
        console.log("New user document created with Google login.");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="glass-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Dropdown for role selection */}
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>
          <button type="submit">Login</button>
        </form>
        <button className="google-btn" onClick={handleGoogleLogin}>
          Login with Google
        </button>
        <p>
          Don't have an account? <a href="/signup">Signup</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
