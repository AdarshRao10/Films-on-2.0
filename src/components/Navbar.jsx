// // src/components/Navbar.jsx
// import React, { useState } from "react";
// import { useCart } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext";
// import { Link, useNavigate } from "react-router-dom";
// import { FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
// import "./Navbar.css";
// import SearchBar from "./SearchBar";
// import supabase from "../supabaseClient";

// const Navbar = ({ toggleSidebar }) => { // 🔥 removed toggleCart (not needed anymore)
//   const { getTotalItems } = useCart();
//   const { user, profile } = useAuth();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     navigate('/');
//   };

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <button className="menu-button" onClick={toggleSidebar}>
//           &#9776;
//         </button>
//       </div>
//       <div className="navbar-center">
//         <Link to="/" className="navbar-logo">
//           Films On Video
//         </Link>
//       </div>
      
//       <div className="navbar-right">
//         <div className="navbar-icons">
//           {user ? (
//             <div className="user-menu">
//               <div className="user-profile" onClick={toggleDropdown}>
//                 <FaUser className="user-icon" />
//                 <span className="username">
//                   {profile ? `${profile.first_name} ${profile.last_name}` : user.email.split('@')[0]}
//                 </span>
//               </div>
//               {showDropdown && (
//                 <div className="user-dropdown">
//                   <Link to="/account" className="dropdown-item">My Account</Link>
//                   <Link to="/orders" className="dropdown-item">My Orders</Link>
//                   <div className="dropdown-divider"></div>
//                   <button onClick={handleLogout} className="dropdown-item logout-button">
//                     <FaSignOutAlt /> Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link to="/login" className="login-link">Login</Link>
//           )}

//           <SearchBar />

//           {/* 🔥 Updated: Cart icon is now a Link */}
//           <Link to="/cart" className="cart-icon">
//             <FaShoppingCart />
//             <span className="cart-count">({getTotalItems()})</span>
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;






import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import "./Navbar.css";
import SearchBar from "./SearchBar";
import supabase from "../supabaseClient";
//import CartDrawer from "./CartDrawer"; // ✅ Make sure this component exists

const Navbar = ({ toggleSidebar, toggleCart }) => {
  const { getTotalItems } = useCart();
  const { user, profile } = useAuth();
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  setShowDropdown(false); // close dropdown when route changes
}, [location.pathname]);
  
  

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // const toggleCartDrawer = () => {
  //   setShowCartDrawer(!showCartDrawer);
  // };

  const username = profile
    ? `${profile.first_name} ${profile.last_name}`
    : user?.email?.split('@')[0];

  
useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

useEffect(() => {
  setShowDropdown(false); // Close dropdown on route change
}, [location.pathname]);


  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="menu-button" onClick={toggleSidebar}>
            &#9776;
          </button>
        </div>

        
        <div className="navbar-center">
          <Link to="/" className="navbar-logo">
            Films On Video
          </Link>
        </div>

        <div className="navbar-right">
          <div className="navbar-icons">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="user-profile">
                    <FaUser className="user-icon" />
                    <span className="username">{username}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="user-dropdown" align="end" sideOffset={5} portal={false}>
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="dropdown-item">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="dropdown-item">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button onClick={handleLogout} className="dropdown-item logout-button">
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              ) : (<div className="login-wrapper" ref={dropdownRef}>
                <button className="login-button" onClick={() => setShowDropdown((v) => !v)}>
                  Login
                </button>
                {showDropdown && (
                  <div className="login-menu">
                    <Link to="/login" onClick={() => setShowDropdown(false)}>Sign In</Link>
                    <Link to="/register" onClick={() => setShowDropdown(false)}>Register</Link>
                  </div>
                )}
              </div>
             )}


            <SearchBar />

            <div className="cart-icon cursor-pointer relative" onClick={toggleCart}>
              <FaShoppingCart />
              <span className="cart-count">({getTotalItems()})</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
