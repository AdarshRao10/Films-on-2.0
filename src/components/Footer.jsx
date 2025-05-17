import React, { useState, useEffect } from "react";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.body.scrollHeight;

    // ✅ Pro tip: Always show footer if page is too short to scroll
    if (fullHeight <= windowHeight + 50) {
      setIsVisible(true);
      return;
    }

    if (scrollTop + windowHeight >= fullHeight - 50) {
      setIsVisible(true); // ✅ Near bottom: show
    } else {
      setIsVisible(false); // ✅ Not at bottom: hide
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // ✅ Run on mount in case page is too short
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="footer visible">
      <div className="footer-content">
        <div className="footer-left">
          <Link to="/contact" className="footer-contact">
            Contact Us
          </Link>
        </div>
        <div className="footer-center">
          <p><b>Store Location</b>: 1922 Park Springs Blvd, Arlington, TX</p>
        </div>
        <div className="footer-right">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="social-icon" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="social-icon" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
