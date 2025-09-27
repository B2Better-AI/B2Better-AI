import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
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
    <div className="homepage">
      {/* Top Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo Section */}
          <div className="nav-left">
            <div className="logo-container">
              <span className="logo-text">Qwippo</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="nav-center">
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

          {/* Right Navigation */}
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
                <li><Link to="/wishlist">Your Wishlist</Link></li>
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

        {/* Secondary Navigation */}
        <div className="nav-secondary">
          <div className="nav-container">
            <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/retailers">Retailers</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/settings">Settings</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Qwippo</h1>
          <p>Your personalized B2B recommendation platform for smarter business decisions</p>
          <div className="hero-buttons">
            <button className="btn-primary">Start Shopping</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <span>🚀</span>
            <p>Discover Amazing Products</p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">💻</div>
              <h3>Electronics</h3>
              <p>Latest gadgets and tech</p>
            </div>
            <div className="category-card">
              <div className="category-icon">👕</div>
              <h3>Fashion</h3>
              <p>Trendy clothing & accessories</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🏠</div>
              <h3>Home & Garden</h3>
              <p>Everything for your home</p>
            </div>
            <div className="category-card">
              <div className="category-icon">⚽</div>
              <h3>Sports</h3>
              <p>Fitness & outdoor gear</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">📱</div>
              <h3>Smartphone Pro</h3>
              <p className="product-price">$599.99</p>
              <div className="product-rating">⭐⭐⭐⭐⭐ (4.8)</div>
            </div>
            <div className="product-card">
              <div className="product-image">🎧</div>
              <h3>Wireless Headphones</h3>
              <p className="product-price">$199.99</p>
              <div className="product-rating">⭐⭐⭐⭐⭐ (4.6)</div>
            </div>
            <div className="product-card">
              <div className="product-image">⌚</div>
              <h3>Smart Watch</h3>
              <p className="product-price">$299.99</p>
              <div className="product-rating">⭐⭐⭐⭐⭐ (4.7)</div>
            </div>
            <div className="product-card">
              <div className="product-image">📷</div>
              <h3>Digital Camera</h3>
              <p className="product-price">$799.99</p>
              <div className="product-rating">⭐⭐⭐⭐⭐ (4.9)</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Get to Know Us</h3>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/press">Press Releases</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Make Money with Us</h3>
              <ul>
                <li><Link to="/sell">Sell products</Link></li>
                <li><Link to="/affiliate">Become an Affiliate</Link></li>
                <li><Link to="/advertise">Advertise Your Products</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Payment Products</h3>
              <ul>
                <li><Link to="/credit-cards">Credit Cards</Link></li>
                <li><Link to="/gift-cards">Gift Cards</Link></li>
                <li><Link to="/payment">Payment Methods</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Qwippo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
