// import React, { useState, useEffect } from "react";
// import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import "./Footer.css";

// const Footer = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   const handleScroll = () => {
//     const scrollTop = window.scrollY;
//     const windowHeight = window.innerHeight;
//     const fullHeight = document.body.scrollHeight;

//     // ✅ Pro tip: Always show footer if page is too short to scroll
//     if (fullHeight <= windowHeight + 50) {
//       setIsVisible(true);
//       return;
//     }

//     if (scrollTop + windowHeight >= fullHeight - 50) {
//       setIsVisible(true); // ✅ Near bottom: show
//     } else {
//       setIsVisible(false); // ✅ Not at bottom: hide
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     handleScroll(); // ✅ Run on mount in case page is too short
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <footer className="footer visible">
//       <div className="footer-content">
//         <div className="footer-left">
//           <Link to="/contact" className="footer-contact">
//             Contact Us
//           </Link>
//         </div>
//         <div className="footer-center">
//           <p><b>Store Location</b>: 1922 Park Springs Blvd, Arlington, TX</p>
//         </div>
//         <div className="footer-right">
//           <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
//             <FaInstagram className="social-icon" />
//           </a>
//           <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
//             <FaFacebookF className="social-icon" />
//           </a>
//           <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
//             <FaLinkedinIn className="social-icon" />
//           </a>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.body.scrollHeight;

    if (fullHeight <= windowHeight + 50 || scrollTop + windowHeight >= fullHeight - 50) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className={cn(
        "transition-opacity duration-300 ease-in-out w-full px-4 py-6 bg-muted/50 border-t",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <Card className="w-full max-w-7xl mx-auto shadow-none border-none bg-transparent">
        <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-4 px-0">
          {/* Left: Contact Link */}
          <div>
            <Link
              to="/contact"
              className="text-sm font-medium hover:underline text-muted-foreground"
            >
              Contact Us
            </Link>
          </div>

          {/* Center: Address */}
          <div className="text-center text-sm text-muted-foreground">
            <b>Store Location:</b> 1922 Park Springs Blvd, Arlington, TX
          </div>

          {/* Right: Social Icons */}
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <FaInstagram className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <FaFacebookF className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <FaLinkedinIn className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;
