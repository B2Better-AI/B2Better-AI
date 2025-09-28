import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

const Retailers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const retailers = [
    {
      id: 1,
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
    },
    {
      id: 2,
      name: "Global Electronics",
      category: "Electronics",
      rating: 4.7,
      reviews: 892,
      location: "Austin, TX",
      established: "2018",
      products: 1800,
      responseTime: "< 4 hours",
      image: "📱",
      verified: true,
      specialties: ["Mobile Devices", "Computers", "Accessories"],
      description: "Your trusted partner for all electronic needs with competitive pricing."
    },
    {
      id: 3,
      name: "Office Supplies Pro",
      category: "Office Supplies",
      rating: 4.6,
      reviews: 654,
      location: "Chicago, IL",
      established: "2012",
      products: 3200,
      responseTime: "< 1 hour",
      image: "📋",
      verified: true,
      specialties: ["Stationery", "Furniture", "Printing"],
      description: "Complete office solutions with fast delivery and excellent customer service."
    },
    {
      id: 4,
      name: "Industrial Parts Co",
      category: "Industrial",
      rating: 4.8,
      reviews: 423,
      location: "Detroit, MI",
      established: "2010",
      products: 1500,
      responseTime: "< 6 hours",
      image: "⚙️",
      verified: true,
      specialties: ["Machinery", "Tools", "Safety Equipment"],
      description: "Industrial-grade parts and equipment for manufacturing and construction."
    },
    {
      id: 5,
      name: "Green Supplies Inc",
      category: "Sustainability",
      rating: 4.5,
      reviews: 312,
      location: "Portland, OR",
      established: "2019",
      products: 800,
      responseTime: "< 3 hours",
      image: "🌱",
      verified: false,
      specialties: ["Eco-Friendly", "Recycled Materials", "Green Energy"],
      description: "Sustainable business solutions for environmentally conscious companies."
    },
    {
      id: 6,
      name: "Heavy Machinery Ltd",
      category: "Industrial",
      rating: 4.9,
      reviews: 189,
      location: "Houston, TX",
      established: "2008",
      products: 450,
      responseTime: "< 8 hours",
      image: "🚜",
      verified: true,
      specialties: ["Construction", "Mining", "Agriculture"],
      description: "Heavy machinery and equipment for construction and industrial applications."
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Electronics", label: "Electronics" },
    { value: "Office Supplies", label: "Office Supplies" },
    { value: "Industrial", label: "Industrial" },
    { value: "Sustainability", label: "Sustainability" }
  ];

  const filteredRetailers = retailers.filter(retailer => {
    const matchesSearch = retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         retailer.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || retailer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedRetailers = [...filteredRetailers].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      case "products":
        return b.products - a.products;
      default:
        return 0;
    }
  });

  return (
    <div className="retailers-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Retailers & Suppliers</h1>
          <p>Discover trusted suppliers and retailers for your business needs</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search retailers, specialties, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
        
        <div className="filter-controls">
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
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
            <option value="products">Sort by Products</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <span className="results-count">{sortedRetailers.length} retailers found</span>
        <div className="view-options">
          <button className="view-btn active">Grid</button>
          <button className="view-btn">List</button>
        </div>
      </div>

      {/* Retailers Grid */}
      <div className="retailers-grid">
        {sortedRetailers.map(retailer => (
          <div key={retailer.id} className="retailer-card">
            <div className="retailer-header">
              <div className="retailer-image">{retailer.image}</div>
              <div className="retailer-info">
                <div className="retailer-name">
                  <h3>{retailer.name}</h3>
                  {retailer.verified && <span className="verified-badge">✓ Verified</span>}
                </div>
                <div className="retailer-category">{retailer.category}</div>
              </div>
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

            <div className="retailer-stats">
              <div className="stat">
                <span className="stat-label">Products</span>
                <span className="stat-value">{retailer.products.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Response Time</span>
                <span className="stat-value">{retailer.responseTime}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Established</span>
                <span className="stat-value">{retailer.established}</span>
              </div>
            </div>

            <div className="retailer-location">
              <span className="location-icon">📍</span>
              {retailer.location}
            </div>

            <div className="retailer-actions">
              <button 
                className="btn-primary"
                onClick={() => navigate(`/retailer/${retailer.id}`)}
              >
                View Profile
              </button>
              <button className="btn-secondary">Contact</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="pagination-btn" disabled>Previous</button>
        <div className="pagination-numbers">
          <button className="pagination-number active">1</button>
          <button className="pagination-number">2</button>
          <button className="pagination-number">3</button>
          <span className="pagination-ellipsis">...</span>
          <button className="pagination-number">10</button>
        </div>
        <button className="pagination-btn">Next</button>
      </div>
    </div>
  );
};

export default Retailers;
