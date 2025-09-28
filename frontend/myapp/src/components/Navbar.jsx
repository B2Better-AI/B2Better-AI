import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <div className="nav-left">
          <div className="logo-container">
            <span className="logo-text">B2Better</span>
          </div>
        </div>

        {/* Search Bar - Left Side */}
        <div className="nav-search">
          <div className="search-container">
            <select className="search-categories">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Garden</option>
              <option>Sports</option>
            </select>
            <input
              type="text"
              placeholder="Search for products, brands, and more..."
              className="search-input"
            />
            <button className="search-button">
              <span>🔍</span>
            </button>
          </div>
        </div>

        {/* Navigation Links - Center Right */}
        <div className="nav-links-container">
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            <li><Link to="/homepage">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/retailers">Retailers</Link></li>
            <li><Link to="/cart">Cart ({getCartItemsCount()})</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </div>

        {/* Profile Section - Right Corner */}
        <div className="nav-right">
          {/* User Dropdown */}
          <div className="nav-item user-menu" onClick={toggleUserMenu}>
            <span className="nav-icon">👤</span>
            <div className="nav-text">
              <span className="nav-label">Account</span>
              <span className="nav-value">Lists</span>
            </div>
            <ul className={`user-dropdown ${userMenuOpen ? "active" : ""}`}>
              <li><Link to="/profile">Your Profile</Link></li>
              <li><Link to="/orders">Your Orders</Link></li>
              <li><Link to="/settings">Account Settings</Link></li>
              <li>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className="logout-btn"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="hamburger" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
