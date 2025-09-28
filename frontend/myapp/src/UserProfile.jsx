import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    company: "",
    position: "",
    phone: "",
    location: "",
    bio: "",
    avatar: "👤",
    joinDate: "",
    totalOrders: 0,
    totalSpent: "$0",
    favoriteCategories: [],
    preferences: {
      notifications: true,
      emailUpdates: true,
      smsAlerts: false,
      weeklyReports: true
    }
  });

  // Update profile data when user data changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        position: user.position || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "",
        totalOrders: user.totalOrders || 0,
        totalSpent: user.totalSpent ? `$${user.totalSpent.toLocaleString()}` : "$0",
        favoriteCategories: user.favoriteCategories || [],
        preferences: {
          notifications: user.preferences?.notifications?.emailUpdates || true,
          emailUpdates: user.preferences?.notifications?.emailUpdates || true,
          smsAlerts: user.preferences?.notifications?.smsAlerts || false,
          weeklyReports: user.preferences?.notifications?.weeklyReports || true
        }
      }));
    }
  }, [user]);

  const recentActivity = [
    { action: "Placed Order", details: "Order #ORD-001 with TechCorp Solutions", time: "2 hours ago", type: "order" },
    { action: "Updated Profile", details: "Changed company information", time: "1 day ago", type: "profile" },
    { action: "Added Supplier", details: "Added Green Supplies Inc to favorites", time: "3 days ago", type: "supplier" },
    { action: "Completed Order", details: "Order #ORD-002 delivered successfully", time: "1 week ago", type: "order" },
    { action: "Updated Preferences", details: "Enabled email notifications", time: "2 weeks ago", type: "settings" }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (pref, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [pref]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  // Show loading state if user data is not available
  if (!user) {
    return (
      <div className="profile-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-large">{profileData.avatar}</div>
          <button className="change-avatar-btn">Change Photo</button>
        </div>
        <div className="profile-info">
          <h1>{profileData.name || "User Profile"}</h1>
          <p className="profile-title">
            {profileData.position && profileData.company 
              ? `${profileData.position} at ${profileData.company}`
              : profileData.position || profileData.company || "Complete your profile"
            }
          </p>
          {profileData.location && (
            <p className="profile-location">📍 {profileData.location}</p>
          )}
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{profileData.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profileData.totalSpent}</span>
              <span className="stat-label">Total Spent</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profileData.joinDate || "Recently"}</span>
              <span className="stat-label">Member Since</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button 
            className="btn-primary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          {isEditing && (
            <button className="btn-secondary" onClick={handleSave}>
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile Information
        </button>
        <button 
          className={`tab ${activeTab === "preferences" ? "active" : ""}`}
          onClick={() => setActiveTab("preferences")}
        >
          Preferences
        </button>
        <button 
          className={`tab ${activeTab === "activity" ? "active" : ""}`}
          onClick={() => setActiveTab("activity")}
        >
          Recent Activity
        </button>
        <button 
          className={`tab ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {activeTab === "profile" && (
          <div className="profile-section">
            <h2>Profile Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={profileData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={profileData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                disabled={!isEditing}
                rows="4"
              />
            </div>
            <div className="form-group full-width">
              <label>Favorite Categories</label>
              <div className="category-tags">
                {profileData.favoriteCategories && profileData.favoriteCategories.length > 0 ? (
                  profileData.favoriteCategories.map((category, index) => (
                    <span key={index} className="category-tag">
                      {category}
                      {isEditing && <button className="remove-tag">×</button>}
                    </span>
                  ))
                ) : (
                  <span className="no-categories">No categories selected</span>
                )}
                {isEditing && (
                  <button className="add-category-btn">+ Add Category</button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="profile-section">
            <h2>Notification Preferences</h2>
            <div className="preferences-grid">
              <div className="preference-item">
                <div className="preference-info">
                  <h3>Email Notifications</h3>
                  <p>Receive updates about orders, suppliers, and recommendations</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.emailUpdates}
                    onChange={(e) => handlePreferenceChange("emailUpdates", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <div className="preference-info">
                  <h3>Push Notifications</h3>
                  <p>Get instant alerts for important updates</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.notifications}
                    onChange={(e) => handlePreferenceChange("notifications", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <div className="preference-info">
                  <h3>SMS Alerts</h3>
                  <p>Receive text messages for urgent updates</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.smsAlerts}
                    onChange={(e) => handlePreferenceChange("smsAlerts", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <div className="preference-info">
                  <h3>Weekly Reports</h3>
                  <p>Get weekly summaries of your activity and recommendations</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={profileData.preferences.weeklyReports}
                    onChange={(e) => handlePreferenceChange("weeklyReports", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="profile-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    {activity.type === "order" && "📦"}
                    {activity.type === "profile" && "👤"}
                    {activity.type === "supplier" && "🏢"}
                    {activity.type === "settings" && "⚙️"}
                  </div>
                  <div className="activity-content">
                    <h4>{activity.action}</h4>
                    <p>{activity.details}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="profile-section">
            <h2>Security Settings</h2>
            <div className="security-options">
              <div className="security-item">
                <div className="security-info">
                  <h3>Change Password</h3>
                  <p>Update your password to keep your account secure</p>
                </div>
                <button className="btn-secondary">Change Password</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button className="btn-secondary">Enable 2FA</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h3>Login History</h3>
                  <p>View recent login attempts and device activity</p>
                </div>
                <button className="btn-secondary">View History</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <h3>Connected Devices</h3>
                  <p>Manage devices that have access to your account</p>
                </div>
                <button className="btn-secondary">Manage Devices</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
