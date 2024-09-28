// HomePage.jsx
import React from "react";
import "../styles/homepage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to Your Website!</h1>
        <p>We are glad to have you here. Explore our services and connect with us.</p>
        <a href="/signup" className="cta-button">Get Started</a>
      </section>

      <section className="about">
        <h2>About Us</h2>
        <p>We provide high-quality services to help you succeed in your business. Our team is dedicated to bringing the best experience to our users. We strive for excellence and aim to foster strong connections with our clients.</p>
      </section>

      <section className="founders">
        <h2>Meet Our Founders</h2>
        <div className="founder-list">
          <div className="founder">
            <img src="/assets/craig.jpeg" alt="Craig Dsouza" />
            <p>Craig Dsouza</p>
          </div>
          <div className="founder">
            <img src="/assets/elvis.jpeg" alt="Elvis Dsouza" />
            <p>Elvis Dsouza</p>
          </div>
          <div className="founder">
            <img src="/assets/jason.jpeg" alt="Jason Dsouza" />
            <p>Jason Dsouza</p>
          </div>
          <div className="founder">
            <img src="/assets/shriya.jpeg" alt="Shriya Saxena" />
            <p>Shriya Saxena</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
