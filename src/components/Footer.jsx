// Footer.jsx
import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <ul className="social-media">
          <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
          <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
          <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
