const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Get headers with auth token
  getHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Ensure errors are consistent
        throw {
          message: data.message || 'Something went wrong',
          errors: data.errors || null
        };
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      // Throw structured error for frontend
      throw {
        message: error.message || 'API request failed',
        errors: error.errors || null
      };
    }
  }

  // Authentication API
  auth = {
    register: (userData) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),

    login: (credentials) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),

    getCurrentUser: () => this.request('/auth/me'),

    updateProfile: (profileData) =>
      this.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      }),

    updatePreferences: (preferences) =>
      this.request('/auth/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences)
      }),

    changePassword: (passwordData) =>
      this.request('/auth/password', {
        method: 'PUT',
        body: JSON.stringify(passwordData)
      }),

    logout: () =>
      this.request('/auth/logout', {
        method: 'POST'
      }),

    deleteAccount: () =>
      this.request('/auth/account', {
        method: 'DELETE'
      })
  };

  // Dashboard API
  dashboard = {
    getStats: (period = 'month') =>
      this.request(`/dashboard/stats?period=${period}`),

    getRecentOrders: (limit = 5) =>
      this.request(`/dashboard/recent-orders?limit=${limit}`),

    getRecommendations: (limit = 6) =>
      this.request(`/recommendations?limit=${limit}`),

    getInsights: () => this.request('/dashboard/insights'),

    getActivity: (page = 1, limit = 10) =>
      this.request(`/dashboard/activity?page=${page}&limit=${limit}`)
  };

  // Retailers API
  retailers = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/retailers?${queryString}`);
    },

    getById: (id) => this.request(`/retailers/${id}`),

    addReview: (id, reviewData) =>
      this.request(`/retailers/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
      }),

    getReviews: (id, page = 1, limit = 10) =>
      this.request(`/retailers/${id}/reviews?page=${page}&limit=${limit}`),

    getProducts: (id, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/retailers/${id}/products?${queryString}`);
    },

    getCategories: () => this.request('/retailers/meta/categories')
  };

  // Orders API
  orders = {
    getAll: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return this.request(`/orders?${queryString}`);
    },

    getById: (id) => this.request(`/orders/${id}`),

    create: (orderData) =>
      this.request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      }),

    updateStatus: (id, statusData) =>
      this.request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(statusData)
      }),

    cancel: (id, reason) =>
      this.request(`/orders/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason })
      }),

    getStats: (period = 'month') =>
      this.request(`/orders/stats/overview?period=${period}`)
  };
}

// Create singleton instance
const apiService = new ApiService();
export default apiService;
