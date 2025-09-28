import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useCart } from "./contexts/CartContext";
import "./App.css";

const HomePage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { getCartItemsCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/login");
  };

  // Category mapping for FakeStore API
  const categoryMap = {
    'all': '',
    'electronics': 'electronics',
    'fashion': "women's clothing",
    'home': 'jewelery',
    'sports': 'men\'s clothing'
  };

  // Available categories in FakeStore API
  const availableCategories = ['electronics', "women's clothing", 'jewelery', "men's clothing"];

  // Fetch products from FakeStore API based on selected category
  const fetchProducts = async (category = 'all') => {
    setLoading(true);
    console.log('Fetching products for category:', category);
    
    try {
      let apiUrl = "https://fakestoreapi.com/products";
      
      if (category !== 'all' && categoryMap[category]) {
        apiUrl = `https://fakestoreapi.com/products/category/${categoryMap[category]}`;
        console.log('API URL:', apiUrl);
      }
      
      const res = await fetch(apiUrl);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Fetched products:', data.length, 'items');
      console.log('Sample product:', data[0]);
      
      // Limit to 8 products for display
      const limitedProducts = data.slice(0, 8);
      setProducts(limitedProducts);
      console.log('Set products:', limitedProducts.length, 'items');
    } catch (err) {
      console.error("Error fetching products:", err);
      // Fallback to all products if category fetch fails
      if (category !== 'all') {
        try {
          const fallbackRes = await fetch("https://fakestoreapi.com/products");
          const fallbackData = await fallbackRes.json();
          setProducts(fallbackData.slice(0, 8));
        } catch (fallbackErr) {
          console.error("Fallback fetch also failed:", fallbackErr);
          setProducts([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection with enhanced feedback
  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    
    // Add haptic feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    setSelectedCategory(category);
    fetchProducts(category);
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts('all');
  }, []);

  return (
    <div className="homepage">
      {/* Merged Navigation Bar */}
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to B2Better</h1>
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
          <div style={{
            background: '#f0f0f0',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            <strong>Debug Info:</strong> Selected Category: {selectedCategory} | Products: {products.length}
          </div>
          <button 
            onClick={() => {
              console.log('Test button clicked');
              handleCategoryClick('electronics');
            }}
            style={{
              background: '#ff9900',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            Test Electronics Category
          </button>
          <div className="categories-grid">
            <div 
              className={`category-card ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => {
                console.log('Direct click on All Products');
                handleCategoryClick('all');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick('all');
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="View all products"
            >
              <div className="category-icon">🛍️</div>
              <h3>All Products</h3>
              <p>Browse all categories</p>
            </div>
            <div 
              className={`category-card ${selectedCategory === 'electronics' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('electronics')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick('electronics');
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="View electronics products"
            >
              <div className="category-icon">💻</div>
              <h3>Electronics</h3>
              <p>Latest gadgets and tech</p>
            </div>
            <div 
              className={`category-card ${selectedCategory === 'fashion' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('fashion')}
            >
              <div className="category-icon">👕</div>
              <h3>Fashion</h3>
              <p>Trendy clothing & accessories</p>
            </div>
            <div 
              className={`category-card ${selectedCategory === 'home' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('home')}
            >
              <div className="category-icon">🏠</div>
              <h3>Home & Garden</h3>
              <p>Everything for your home</p>
            </div>
            <div 
              className={`category-card ${selectedCategory === 'sports' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('sports')}
            >
              <div className="category-icon">⚽</div>
              <h3>Sports</h3>
              <p>Fitness & outdoor gear</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Products */}
      <section className="products-section">
        <div className="container">
          <h2>
            {selectedCategory === 'all' 
              ? 'Featured Products' 
              : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`
            }
            <span style={{fontSize: '14px', color: '#666', marginLeft: '10px'}}>
              ({products.length} products)
            </span>
          </h2>
          <div className="products-grid" key={selectedCategory}>
            {loading ? (
              <>
                {/* Skeleton Loading Cards */}
                {[...Array(8)].map((_, index) => (
                  <div key={`skeleton-${index}`} className="skeleton-card">
                    <div className="skeleton skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton skeleton-title"></div>
                      <div className="skeleton skeleton-price"></div>
                      <div className="skeleton skeleton-rating"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div className="product-card" key={`${selectedCategory}-${product.id}`}>
                  <div className="product-image">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="product-content">
                    <h3>{product.title}</h3>
                    <p className="product-price">${product.price}</p>
                    <div className="product-rating">⭐ {product.rating?.rate} ({product.rating?.count})</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <p>No products found for this category.</p>
              </div>
            )}
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
            <p>&copy; 2024 B2Better. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
