import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './contexts/CartContext';
import './App.css';

const RetailerProfile = () => {
  const { retailerId } = useParams();
  const navigate = useNavigate();
  const { addToCart, getCartItemsCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Dummy retailer data
  const retailer = {
    id: parseInt(retailerId),
    name: "TechCorp Solutions",
    category: "Electronics",
    rating: 4.9,
    reviews: 1247,
    location: "San Francisco, CA",
    established: "2015",
    products: 2500,
    responseTime: "< 2 hours",
    image: "💻",
    verified: true,
    specialties: ["Smart Office", "IT Equipment", "Software"],
    description: "Leading provider of smart office solutions and IT equipment for modern businesses."
  };

  // Dummy products data
  const products = [
    {
      id: 1,
      name: "Professional Laptop - Dell XPS 15",
      price: 1299.99,
      category: "Laptops",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop",
      rating: 4.8,
      reviews: 156,
      description: "High-performance laptop for business professionals",
      inStock: true,
      stockCount: 25
    },
    {
      id: 2,
      name: "Wireless Mouse - Logitech MX Master 3",
      price: 99.99,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop",
      rating: 4.9,
      reviews: 89,
      description: "Premium wireless mouse with advanced tracking",
      inStock: true,
      stockCount: 50
    },
    {
      id: 3,
      name: "Mechanical Keyboard - Keychron K2",
      price: 79.99,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop",
      rating: 4.7,
      reviews: 203,
      description: "Compact mechanical keyboard for productivity",
      inStock: true,
      stockCount: 30
    },
    {
      id: 4,
      name: "Monitor - LG UltraWide 34\"",
      price: 449.99,
      category: "Monitors",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=200&fit=crop",
      rating: 4.6,
      reviews: 78,
      description: "Ultra-wide monitor for enhanced productivity",
      inStock: true,
      stockCount: 15
    },
    {
      id: 5,
      name: "Webcam - Logitech C920 HD Pro",
      price: 69.99,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=300&h=200&fit=crop",
      rating: 4.5,
      reviews: 124,
      description: "HD webcam for professional video calls",
      inStock: false,
      stockCount: 0
    },
    {
      id: 6,
      name: "Standing Desk - Autonomous SmartDesk",
      price: 399.99,
      category: "Furniture",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop",
      rating: 4.8,
      reviews: 67,
      description: "Electric standing desk for healthy work habits",
      inStock: true,
      stockCount: 8
    }
  ];

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'Laptops', label: 'Laptops' },
    { value: 'Accessories', label: 'Accessories' },
    { value: 'Monitors', label: 'Monitors' },
    { value: 'Furniture', label: 'Furniture' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleAddToCart = (product) => {
    // Add retailer information to the product
    const productWithRetailer = {
      ...product,
      retailer: retailer.name,
      retailerId: retailer.id
    };
    addToCart(productWithRetailer);
    // You could add a toast notification here
    console.log(`Added ${product.name} to cart from ${retailer.name}`);
  };

  return (
    <div className="retailer-profile-page">
      {/* Header */}
      <div className="profile-header">
        <button 
          className="back-button"
          onClick={() => navigate('/retailers')}
        >
          ← Back to Retailers
        </button>
        
        <div className="retailer-info">
          <div className="retailer-image-large">{retailer.image}</div>
          <div className="retailer-details">
            <h1>{retailer.name}</h1>
            <div className="retailer-meta">
              <span className="category">{retailer.category}</span>
              {retailer.verified && <span className="verified-badge">✓ Verified</span>}
            </div>
            <div className="retailer-rating">
              <div className="stars">
                {"★".repeat(Math.floor(retailer.rating))}
                <span className="rating-value">{retailer.rating}</span>
              </div>
              <span className="reviews-count">({retailer.reviews} reviews)</span>
            </div>
            <p className="retailer-description">{retailer.description}</p>
            <div className="retailer-specialties">
              {retailer.specialties.map((specialty, index) => (
                <span key={index} className="specialty-tag">{specialty}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <div className="section-header">
          <h2>Products ({sortedProducts.length})</h2>
          <div className="cart-info">
            <span className="cart-count">🛒 {getCartItemsCount()} items</span>
          </div>
        </div>

        {/* Filters */}
        <div className="product-filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {sortedProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {!product.inStock && (
                  <div className="out-of-stock-overlay">
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="product-content">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-rating">
                  <span className="stars">{"★".repeat(Math.floor(product.rating))}</span>
                  <span className="rating-value">{product.rating}</span>
                  <span className="reviews">({product.reviews})</span>
                </div>
                <div className="product-price">${product.price}</div>
                <div className="product-stock">
                  {product.inStock ? (
                    <span className="in-stock">✓ In Stock ({product.stockCount})</span>
                  ) : (
                    <span className="out-of-stock">✗ Out of Stock</span>
                  )}
                </div>
                <button
                  className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? `Add to Cart (${product.stockCount} available)` : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RetailerProfile;
