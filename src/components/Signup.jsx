import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase"; // Import Firestore instance
import "../styles/signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Student"); // Add role state for dropdown
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create the user document in Firestore with role
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role, // Save the selected role (Student/Teacher)
        isOnline: false, // Initial online status
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create the user document in Firestore with role
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "Unknown",
        email: user.email,
        role: role, // Save the selected role (Student/Teacher)
        isOnline: false,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Google sign-up error:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="glass-card"> {/* Added glass-card for styling */}
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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

          {/* Dropdown for selecting role */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
          </select>

          <button type="submit">Signup</button>
        </form>

        <button className="google-btn" onClick={handleGoogleSignup}>
          Signup with Google
        </button>
        
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
