import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase"; // Import Firestore instance
import { TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { motion } from "framer-motion";
import { Google } from "@mui/icons-material"; // Import Google icon
import signImage from '../assets/sign.svg'; // Adjust the path based on your folder structure
import "../styles/signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Student");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: role,
        isOnline: false,
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

      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName || "Unknown",
        email: user.email,
        role: role,
        isOnline: false,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Google sign-up error:", error);
    }
  };

  return (
    <div className="signup-container">
      <motion.div 
        className="left-side"
        initial={{ opacity: 0, x: -100 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <img src={signImage} alt="Sign Up" className="sign-image" />
      </motion.div>

      <motion.div 
        className="right-side glass-card"
        initial={{ opacity: 0, x: 100 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
              required
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Teacher">Teacher</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Signup
          </Button>
        </form>

        {/* Google Signup Button with Icon */}
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<Google />}
          onClick={handleGoogleSignup}
          className="google-btn"
        >
          Signup with Google
        </Button>


        <p className="login-prompt">
          Already have an account? <a href="/login">Login</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
