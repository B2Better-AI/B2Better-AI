import { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      language: "en",
      timezone: "America/New_York",
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      theme: "light"
    },
    notifications: {
      emailOrders: true,
      emailSuppliers: true,
      emailRecommendations: true,
      pushOrders: true,
      pushSuppliers: false,
      pushRecommendations: true,
      smsUrgent: false,
      weeklyDigest: true,
      monthlyReport: true
    },
    privacy: {
      profileVisibility: "private",
      showActivity: false,
      allowMessages: true,
      dataSharing: false,
      analytics: true
    },
    billing: {
      paymentMethod: "credit_card",
      billingAddress: "123 Business St, New York, NY 10001",
      taxId: "12-3456789",
      invoiceFrequency: "monthly"
    },
    integrations: {
      erpSystem: "none",
      accountingSoftware: "none",
      crmSystem: "none",
      apiAccess: false
    }
  });

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      // Reset to default values
      setSettings({
        general: {
          language: "en",
          timezone: "America/New_York",
          currency: "USD",
          dateFormat: "MM/DD/YYYY",
          theme: "light"
        },
        notifications: {
          emailOrders: true,
          emailSuppliers: true,
          emailRecommendations: true,
          pushOrders: true,
          pushSuppliers: false,
          pushRecommendations: true,
          smsUrgent: false,
          weeklyDigest: true,
          monthlyReport: true
        },
        privacy: {
          profileVisibility: "private",
          showActivity: false,
          allowMessages: true,
          dataSharing: false,
          analytics: true
        },
        billing: {
          paymentMethod: "credit_card",
          billingAddress: "123 Business St, New York, NY 10001",
          taxId: "12-3456789",
          invoiceFrequency: "monthly"
        },
        integrations: {
          erpSystem: "none",
          accountingSoftware: "none",
          crmSystem: "none",
          apiAccess: false
        }
      });
    }
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and configuration</p>
        <div className="settings-actions">
          <button className="btn-secondary" onClick={handleReset}>Reset to Default</button>
          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>

      <div className="settings-container">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <nav className="settings-nav">
            <button 
              className={`nav-item ${activeSection === "general" ? "active" : ""}`}
              onClick={() => setActiveSection("general")}
            >
              <span className="nav-icon">⚙️</span>
              General
            </button>
            <button 
              className={`nav-item ${activeSection === "notifications" ? "active" : ""}`}
              onClick={() => setActiveSection("notifications")}
            >
              <span className="nav-icon">🔔</span>
              Notifications
            </button>
            <button 
              className={`nav-item ${activeSection === "privacy" ? "active" : ""}`}
              onClick={() => setActiveSection("privacy")}
            >
              <span className="nav-icon">🔒</span>
              Privacy
            </button>
            <button 
              className={`nav-item ${activeSection === "billing" ? "active" : ""}`}
              onClick={() => setActiveSection("billing")}
            >
              <span className="nav-icon">💳</span>
              Billing
            </button>
            <button 
              className={`nav-item ${activeSection === "integrations" ? "active" : ""}`}
              onClick={() => setActiveSection("integrations")}
            >
              <span className="nav-icon">🔗</span>
              Integrations
            </button>
            <button 
              className={`nav-item ${activeSection === "advanced" ? "active" : ""}`}
              onClick={() => setActiveSection("advanced")}
            >
              <span className="nav-icon">🔧</span>
              Advanced
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="settings-content">
          {activeSection === "general" && (
            <div className="settings-section">
              <h2>General Settings</h2>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Language</label>
                  <select 
                    value={settings.general.language}
                    onChange={(e) => handleSettingChange("general", "language", e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Timezone</label>
                  <select 
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingChange("general", "timezone", e.target.value)}
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Currency</label>
                  <select 
                    value={settings.general.currency}
                    onChange={(e) => handleSettingChange("general", "currency", e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Date Format</label>
                  <select 
                    value={settings.general.dateFormat}
                    onChange={(e) => handleSettingChange("general", "dateFormat", e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Theme</label>
                  <select 
                    value={settings.general.theme}
                    onChange={(e) => handleSettingChange("general", "theme", e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="settings-section">
              <h2>Notification Settings</h2>
              <div className="notification-groups">
                <div className="notification-group">
                  <h3>Email Notifications</h3>
                  <div className="notification-items">
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>Order Updates</h4>
                        <p>Get notified about order status changes</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailOrders}
                          onChange={(e) => handleSettingChange("notifications", "emailOrders", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>Supplier Updates</h4>
                        <p>New suppliers and supplier changes</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailSuppliers}
                          onChange={(e) => handleSettingChange("notifications", "emailSuppliers", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>AI Recommendations</h4>
                        <p>New product recommendations</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailRecommendations}
                          onChange={(e) => handleSettingChange("notifications", "emailRecommendations", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="notification-group">
                  <h3>Push Notifications</h3>
                  <div className="notification-items">
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>Order Alerts</h4>
                        <p>Instant notifications for order updates</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushOrders}
                          onChange={(e) => handleSettingChange("notifications", "pushOrders", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>Supplier Messages</h4>
                        <p>Messages from suppliers</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushSuppliers}
                          onChange={(e) => handleSettingChange("notifications", "pushSuppliers", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>Recommendations</h4>
                        <p>New AI-powered recommendations</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushRecommendations}
                          onChange={(e) => handleSettingChange("notifications", "pushRecommendations", e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="settings-section">
              <h2>Privacy Settings</h2>
              <div className="privacy-options">
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h3>Profile Visibility</h3>
                    <p>Control who can see your profile information</p>
                  </div>
                  <select 
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange("privacy", "profileVisibility", e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="suppliers">Suppliers Only</option>
                  </select>
                </div>
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h3>Show Activity</h3>
                    <p>Allow others to see your recent activity</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showActivity}
                      onChange={(e) => handleSettingChange("privacy", "showActivity", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h3>Allow Messages</h3>
                    <p>Let suppliers contact you directly</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowMessages}
                      onChange={(e) => handleSettingChange("privacy", "allowMessages", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="privacy-item">
                  <div className="privacy-info">
                    <h3>Data Sharing</h3>
                    <p>Share anonymized data for platform improvement</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.privacy.dataSharing}
                      onChange={(e) => handleSettingChange("privacy", "dataSharing", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === "billing" && (
            <div className="settings-section">
              <h2>Billing Settings</h2>
              <div className="billing-options">
                <div className="billing-item">
                  <div className="billing-info">
                    <h3>Payment Method</h3>
                    <p>Manage your payment methods</p>
                  </div>
                  <button className="btn-secondary">Manage Payment Methods</button>
                </div>
                <div className="billing-item">
                  <div className="billing-info">
                    <h3>Billing Address</h3>
                    <p>{settings.billing.billingAddress}</p>
                  </div>
                  <button className="btn-secondary">Update Address</button>
                </div>
                <div className="billing-item">
                  <div className="billing-info">
                    <h3>Tax Information</h3>
                    <p>Tax ID: {settings.billing.taxId}</p>
                  </div>
                  <button className="btn-secondary">Update Tax Info</button>
                </div>
                <div className="billing-item">
                  <div className="billing-info">
                    <h3>Invoice Frequency</h3>
                    <p>How often you receive invoices</p>
                  </div>
                  <select 
                    value={settings.billing.invoiceFrequency}
                    onChange={(e) => handleSettingChange("billing", "invoiceFrequency", e.target.value)}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === "integrations" && (
            <div className="settings-section">
              <h2>Integrations</h2>
              <div className="integration-options">
                <div className="integration-item">
                  <div className="integration-info">
                    <h3>ERP System</h3>
                    <p>Connect your Enterprise Resource Planning system</p>
                  </div>
                  <select 
                    value={settings.integrations.erpSystem}
                    onChange={(e) => handleSettingChange("integrations", "erpSystem", e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="sap">SAP</option>
                    <option value="oracle">Oracle</option>
                    <option value="microsoft">Microsoft Dynamics</option>
                  </select>
                </div>
                <div className="integration-item">
                  <div className="integration-info">
                    <h3>Accounting Software</h3>
                    <p>Sync with your accounting system</p>
                  </div>
                  <select 
                    value={settings.integrations.accountingSoftware}
                    onChange={(e) => handleSettingChange("integrations", "accountingSoftware", e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="quickbooks">QuickBooks</option>
                    <option value="xero">Xero</option>
                    <option value="freshbooks">FreshBooks</option>
                  </select>
                </div>
                <div className="integration-item">
                  <div className="integration-info">
                    <h3>CRM System</h3>
                    <p>Connect your Customer Relationship Management system</p>
                  </div>
                  <select 
                    value={settings.integrations.crmSystem}
                    onChange={(e) => handleSettingChange("integrations", "crmSystem", e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="salesforce">Salesforce</option>
                    <option value="hubspot">HubSpot</option>
                    <option value="pipedrive">Pipedrive</option>
                  </select>
                </div>
                <div className="integration-item">
                  <div className="integration-info">
                    <h3>API Access</h3>
                    <p>Enable API access for custom integrations</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.integrations.apiAccess}
                      onChange={(e) => handleSettingChange("integrations", "apiAccess", e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === "advanced" && (
            <div className="settings-section">
              <h2>Advanced Settings</h2>
              <div className="advanced-options">
                <div className="advanced-item">
                  <div className="advanced-info">
                    <h3>Data Export</h3>
                    <p>Download all your data in a portable format</p>
                  </div>
                  <button className="btn-secondary">Export Data</button>
                </div>
                <div className="advanced-item">
                  <div className="advanced-info">
                    <h3>Account Deletion</h3>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button className="btn-danger">Delete Account</button>
                </div>
                <div className="advanced-item">
                  <div className="advanced-info">
                    <h3>API Documentation</h3>
                    <p>Access our API documentation for developers</p>
                  </div>
                  <button className="btn-secondary">View API Docs</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
