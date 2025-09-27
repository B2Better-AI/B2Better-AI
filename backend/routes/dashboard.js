const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Retailer = require('../models/Retailer');
const Product = require('../models/Product');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/validation');

const router = express.Router();

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { period = 'month' } = req.query;

  // Calculate date range based on period
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  // Get orders in period
  const orders = await Order.find({
    user: userId,
    createdAt: { $gte: startDate, $lte: now }
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.pricing.total, 0);
  
  // Get active suppliers (retailers with orders)
  const activeSupplierIds = [...new Set(orders.map(order => order.retailer.toString()))];
  const activeSuppliers = activeSupplierIds.length;
  
  // Calculate conversion rate (simplified - orders per unique retailer)
  const conversionRate = activeSuppliers > 0 ? (totalOrders / activeSuppliers * 100).toFixed(1) : 0;

  // Get previous period for comparison
  const periodLength = now.getTime() - startDate.getTime();
  const prevStartDate = new Date(startDate.getTime() - periodLength);
  
  const prevOrders = await Order.find({
    user: userId,
    createdAt: { $gte: prevStartDate, $lt: startDate }
  });

  const prevTotalOrders = prevOrders.length;
  const prevTotalRevenue = prevOrders.reduce((sum, order) => sum + order.pricing.total, 0);
  const prevActiveSuppliers = [...new Set(prevOrders.map(order => order.retailer.toString()))].length;
  const prevConversionRate = prevActiveSuppliers > 0 ? (prevTotalOrders / prevActiveSuppliers * 100).toFixed(1) : 0;

  // Calculate percentage changes
  const ordersChange = prevTotalOrders > 0 ? 
    (((totalOrders - prevTotalOrders) / prevTotalOrders) * 100).toFixed(1) : 
    totalOrders > 0 ? 100 : 0;
  
  const revenueChange = prevTotalRevenue > 0 ? 
    (((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100).toFixed(1) : 
    totalRevenue > 0 ? 100 : 0;
  
  const suppliersChange = prevActiveSuppliers > 0 ? 
    (((activeSuppliers - prevActiveSuppliers) / prevActiveSuppliers) * 100).toFixed(1) : 
    activeSuppliers > 0 ? 100 : 0;
  
  const conversionChange = prevConversionRate > 0 ? 
    (((conversionRate - prevConversionRate) / prevConversionRate) * 100).toFixed(1) : 
    conversionRate > 0 ? 100 : 0;

  res.json({
    success: true,
    data: {
      totalOrders: {
        value: totalOrders.toLocaleString(),
        change: `${ordersChange > 0 ? '+' : ''}${ordersChange}%`,
        trend: ordersChange >= 0 ? 'up' : 'down'
      },
      revenue: {
        value: `$${totalRevenue.toLocaleString()}`,
        change: `${revenueChange > 0 ? '+' : ''}${revenueChange}%`,
        trend: revenueChange >= 0 ? 'up' : 'down'
      },
      activeSuppliers: {
        value: activeSuppliers.toString(),
        change: `${suppliersChange > 0 ? '+' : ''}${suppliersChange}%`,
        trend: suppliersChange >= 0 ? 'up' : 'down'
      },
      conversionRate: {
        value: `${conversionRate}%`,
        change: `${conversionChange > 0 ? '+' : ''}${conversionChange}%`,
        trend: conversionChange >= 0 ? 'up' : 'down'
      }
    }
  });
}));

// @desc    Get recent orders
// @route   GET /api/dashboard/recent-orders
// @access  Private
router.get('/recent-orders', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { limit = 5 } = req.query;

  const orders = await Order.find({ user: userId })
    .populate('retailer', 'name')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  const recentOrders = orders.map(order => ({
    id: order.orderNumber,
    supplier: order.retailer.name,
    amount: `$${order.pricing.total.toLocaleString()}`,
    status: order.status,
    date: order.createdAt.toISOString().split('T')[0]
  }));

  res.json({
    success: true,
    data: recentOrders
  });
}));

// @desc    Get AI recommendations
// @route   GET /api/dashboard/recommendations
// @access  Private
router.get('/recommendations', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { limit = 3 } = req.query;

  // Get user's favorite categories
  const user = await User.findById(userId);
  const favoriteCategories = user.favoriteCategories || ['Electronics', 'Office Supplies'];

  // Get featured products from user's favorite categories
  const recommendations = await Product.find({
    category: { $in: favoriteCategories },
    status: 'active',
    isActive: true
  })
    .populate('retailer', 'name')
    .sort({ 'rating.average': -1, featured: -1 })
    .limit(parseInt(limit));

  const formattedRecommendations = recommendations.map(product => ({
    title: product.name,
    supplier: product.retailer.name,
    rating: product.rating.average,
    price: `$${product.getCurrentPrice().toLocaleString()}`,
    savings: product.pricing.isOnSale ? 
      `Save ${Math.round(((product.pricing.basePrice - product.pricing.salePrice) / product.pricing.basePrice) * 100)}%` : 
      'Best Price',
    image: '💻' // Placeholder - in real app, use product.images[0]?.url
  }));

  res.json({
    success: true,
    data: formattedRecommendations
  });
}));

// @desc    Get market insights
// @route   GET /api/dashboard/insights
// @access  Private
router.get('/insights', protect, asyncHandler(async (req, res) => {
  // Get trending categories (based on recent orders)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const trendingCategories = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'products' } },
    { $unwind: '$products' },
    { $group: { _id: '$products.category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);

  // Get top suppliers (based on ratings and reviews)
  const topSuppliers = await Retailer.find({ isActive: true })
    .sort({ 'rating.average': -1, 'rating.count': -1 })
    .limit(3)
    .select('name rating');

  const insights = {
    trendingCategories: trendingCategories.map(cat => ({
      category: cat._id,
      value: `+${Math.floor(Math.random() * 30) + 10}%` // Mock data
    })),
    topSuppliers: topSuppliers.map(supplier => ({
      name: supplier.name,
      rating: supplier.rating.average.toFixed(1)
    }))
  };

  res.json({
    success: true,
    data: insights
  });
}));

// @desc    Get user activity
// @route   GET /api/dashboard/activity
// @access  Private
router.get('/activity', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const activities = await Activity.getUserActivities(userId, parseInt(page), parseInt(limit));

  res.json({
    success: true,
    data: activities
  });
}));

module.exports = router;
