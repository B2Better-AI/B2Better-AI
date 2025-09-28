import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import logoImg from './assets/B2Better-logo.jpg';


const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      {/* Background Elements */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Navigation */}
<nav className="landing-nav">
  <div className="nav-content">
    <div className="logo-container" style={{ display: 'flex', alignItems: 'center' }}>
      {/* Logo image */}
      <img
        src={logoImg}
        alt="B2Better logo"
        className={`header-logo ${isLoaded ? 'animate' : ''}`}
        style={{ height: "56px", marginRight: "10px" }}
      />
      {/* Logo text immediately after logo */}
      <h1 className={`logo-text ${isLoaded ? 'animate' : ''}`} style={{ margin: 0 }}>
        B2Better
      </h1>
    </div>

    <div className="nav-buttons">
      <button className="nav-btn secondary" onClick={handleLogin}>
        Login
      </button>
      <button className="nav-btn primary" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  </div>
</nav>


      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <div className={`hero-text ${isLoaded ? 'animate' : ''}`}>
            <h2 className="hero-title">
              Better deals, 
              <span className="highlight"> Better margins</span>
            </h2>
            <p className="hero-description">
              B2Better is your gateway to seamless business-to-business connections. 
              Build meaningful partnerships, discover new opportunities, and accelerate 
              your business growth with our innovative platform.
            </p>
            <div className="hero-buttons">
              <button className="cta-button primary" onClick={handleGetStarted}>
                Start Your Journey
                <span className="button-arrow">→</span>
              </button>
              <button className="cta-button secondary" onClick={handleLogin}>
                Sign In
              </button>
            </div>
          </div>
          
          <div className={`hero-visual ${isLoaded ? 'animate' : ''}`}>
            <div className="visual-container">
              <div className="cards-grid">
                <div className="floating-card card-1">
                  <div className="card-icon">📊</div>
                  <div className="card-text">Analytics</div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">🤝</div>
                  <div className="card-text">Partnerships</div>
                </div>
                <div className="floating-card card-3">
                  <div className="card-icon">🚀</div>
                  <div className="card-text">Growth</div>
                </div>
                <div className="floating-card card-4">
                  <div className="card-icon">💼</div>
                  <div className="card-text">Business</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className={`features-section ${isLoaded ? 'animate' : ''}`}>
        <div className="features-container">
          <h3 className="features-title">Why Choose B2Better?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h4>Seamless Connections</h4>
              <p>Connect with verified business partners and expand your network effortlessly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h4>Growth Analytics</h4>
              <p>Track your business relationships and measure growth with detailed insights.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡</div>
              <h4>Secure Platform</h4>
              <p>Your business data is protected with enterprise-grade security measures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo-icon small">
              <svg viewBox="0 0 100 100" className="handshake-logo">
                <defs>
                  <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff8c00" />
                    <stop offset="50%" stopColor="#ffa500" />
                    <stop offset="100%" stopColor="#ff6b35" />
                  </linearGradient>
                </defs>
                <path 
                  d="M20 40 Q30 20 40 30 Q50 25 60 35 Q70 30 80 40 Q85 45 80 50 Q75 55 70 50 Q65 45 60 50 Q55 55 50 50 Q45 45 40 50 Q35 55 30 50 Q25 45 20 50 Q15 45 20 40 Z"
                  fill="url(#footerGradient)"
                  stroke="url(#footerGradient)"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <span>B2Better</span>
          </div>
          <p>&copy; 2024 B2Better. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;