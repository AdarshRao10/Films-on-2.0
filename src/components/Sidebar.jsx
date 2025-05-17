import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  // Click overlay => close
  const handleOverlayClick = () => {
    toggleSidebar();
  };

  // Click inside => do NOT close
  const handleSidebarClick = (e) => {
    e.stopPropagation();
  };

  // Navigate and close
  const handleNavigation = (path) => {
    navigate(path);
    toggleSidebar();
  };

  return (
    <div
      className={`sidebar-overlay ${isOpen ? "open" : ""}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`sidebar ${isOpen ? "open" : ""}`}
        onClick={handleSidebarClick}
      >
        <ul>
          <li onClick={() => handleNavigation("/")}>Home</li>
          <li onClick={() => handleNavigation("/movies")}>Movies</li>
          <li onClick={() => handleNavigation("/adult-movies")}>Adult Movies</li>
          <li onClick={() => handleNavigation("/account")}>Account</li>
          <li onClick={() => handleNavigation("/orders")}>Orders</li>
          <li onClick={() => handleNavigation("/other-services")}>Other Services</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
