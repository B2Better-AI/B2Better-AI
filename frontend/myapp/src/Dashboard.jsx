import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import api from "./services/api";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const stats = [
    { title: "Total Orders", value: "1,247", change: "+12%", trend: "up" },
    { title: "Revenue", value: "$45,230", change: "+8%", trend: "up" },
    { title: "Active Suppliers", value: "156", change: "+5%", trend: "up" },
    { title: "Conversion Rate", value: "3.2%", change: "-2%", trend: "down" }
  ];

  const recentOrders = [
    { id: "#ORD-001", supplier: "TechCorp Solutions", amount: "$2,450", status: "Completed", date: "2024-01-15" },
    { id: "#ORD-002", supplier: "Global Electronics", amount: "$1,890", status: "Processing", date: "2024-01-14" },
    { id: "#ORD-003", supplier: "Office Supplies Pro", amount: "$890", status: "Shipped", date: "2024-01-13" },
    { id: "#ORD-004", supplier: "Industrial Parts Co", amount: "$3,200", status: "Pending", date: "2024-01-12" }
  ];

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const resp = await api.request('/recommendations?limit=6');
        if (isMounted) setRecommendations(resp.data || []);
      } catch (e) {
        console.error('Failed to load recommendations', e);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="dashboard-controls">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-selector"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn-primary">Export Report</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.trend}`}>
                <span className="trend-icon">
                  {stat.trend === 'up' ? '↗' : '↘'}
                </span>
                {stat.change} from last period
              </div>
            </div>
            <div className="stat-chart">
              <div className="mini-chart">
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '80%'}}></div>
                <div className="chart-bar" style={{height: '45%'}}></div>
                <div className="chart-bar" style={{height: '90%'}}></div>
                <div className="chart-bar" style={{height: '70%'}}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Orders */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/orders" className="view-all-link">View All</Link>
          </div>
          <div className="orders-table">
            <div className="table-header">
              <div>Order ID</div>
              <div>Supplier</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Date</div>
            </div>
            {recentOrders.map((order, index) => (
              <div key={index} className="table-row">
                <div className="order-id">{order.id}</div>
                <div className="supplier">{order.supplier}</div>
                <div className="amount">{order.amount}</div>
                <div className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
                <div className="date">{order.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>AI-Powered Recommendations</h2>
            <span className="ai-badge">Powered by AI</span>
          </div>
          <div className="recommendations-grid">
            {recommendations.map((rec, index) => (
              <div key={rec.productId || index} className="recommendation-card">
                <div className="rec-image">{rec.image ? <img src={rec.image} alt={rec.title} /> : '🛒'}</div>
                <div className="rec-content">
                  <h3>{rec.title}</h3>
                  {rec.category && <p className="supplier">{rec.category}</p>}
                  <div className="rec-rating">
                    <span className="stars">★</span>
                    <span className="rating-value">{(rec.score || 0).toFixed(2)}</span>
                  </div>
                  <div className="rec-pricing">
                    <span className="price">{rec.price ? `$${rec.price}` : 'Best Price'}</span>
                    <span className="savings">Recommended</span>
                  </div>
                </div>
                <button className="btn-secondary">View Details</button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/suppliers" className="action-card">
              <div className="action-icon">🏢</div>
              <h3>Find Suppliers</h3>
              <p>Discover new suppliers</p>
            </Link>
            <Link to="/products" className="action-card">
              <div className="action-icon">📦</div>
              <h3>Browse Products</h3>
              <p>Explore product catalog</p>
            </Link>
            <Link to="/orders" className="action-card">
              <div className="action-icon">📋</div>
              <h3>Manage Orders</h3>
              <p>Track your orders</p>
            </Link>
            <Link to="/analytics" className="action-card">
              <div className="action-icon">📊</div>
              <h3>View Analytics</h3>
              <p>Business insights</p>
            </Link>
          </div>
        </div>

        {/* Market Insights */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Market Insights</h2>
          </div>
          <div className="insights-grid">
            <div className="insight-card">
              <h3>Trending Categories</h3>
              <div className="trend-list">
                <div className="trend-item">
                  <span className="trend-category">Electronics</span>
                  <span className="trend-value">+25%</span>
                </div>
                <div className="trend-item">
                  <span className="trend-category">Office Supplies</span>
                  <span className="trend-value">+18%</span>
                </div>
                <div className="trend-item">
                  <span className="trend-category">Industrial</span>
                  <span className="trend-value">+12%</span>
                </div>
              </div>
            </div>
            <div className="insight-card">
              <h3>Top Suppliers</h3>
              <div className="supplier-list">
                <div className="supplier-item">
                  <span className="supplier-name">TechCorp Solutions</span>
                  <span className="supplier-rating">4.9★</span>
                </div>
                <div className="supplier-item">
                  <span className="supplier-name">Global Electronics</span>
                  <span className="supplier-rating">4.7★</span>
                </div>
                <div className="supplier-item">
                  <span className="supplier-name">Office Supplies Pro</span>
                  <span className="supplier-rating">4.6★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
