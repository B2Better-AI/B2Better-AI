const express = require('express');
const Order = require('../models/Order');
const Retailer = require('../models/Retailer');
const Product = require('../models/Product');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/validation');

const router = express.Router();

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const {
    status,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = { user: req.user._id, isActive: true };

  if (status && status !== 'all') {
    query.status = status;
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const orders = await Order.find(query)
    .populate('retailer', 'name category location')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: orders.map(order => ({
      id: order.orderNumber,
      supplier: order.retailer.name,
      amount: `$${order.pricing.total.toLocaleString()}`,
      status: order.status,
      date: order.createdAt.toISOString().split('T')[0],
      itemCount: order.items.length,
      retailer: {
        id: order.retailer._id,
        name: order.retailer.name,
        category: order.retailer.category,
        location: `${order.retailer.location.city}, ${order.retailer.location.state}`
      }
    })),
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
      limit: parseInt(limit)
    }
  });
}));

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    orderNumber: req.params.id,
    user: req.user._id,
    isActive: true
  })
    .populate('retailer', 'name email phone location')
    .populate('user', 'name email phone');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.json({
    success: true,
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items,
      pricing: order.pricing,
      shipping: order.shipping,
      payment: order.payment,
      notes: order.notes,
      timeline: order.timeline,
      retailer: order.retailer,
      user: order.user
    }
  });
}));

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    retailerId,
    items,
    shippingAddress,
    paymentMethod,
    notes
  } = req.body;

  // Validate retailer exists
  const retailer = await Retailer.findById(retailerId);
  if (!retailer || !retailer.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Retailer not found'
    });
  }

  // Validate items
  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Order must contain at least one item'
    });
  }

  // Calculate pricing
  let subtotal = 0;
  const processedItems = items.map(item => {
    const itemTotal = item.quantity * item.unitPrice;
    subtotal += itemTotal;
    return {
      product: {
        name: item.name,
        description: item.description || '',
        category: item.category || '',
        sku: item.sku || ''
      },
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: itemTotal
    };
  });

  const tax = subtotal * 0.08; // 8% tax - in real app, calculate based on location
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  // Create order
  const order = await Order.create({
    user: req.user._id,
    retailer: retailerId,
    items: processedItems,
    pricing: {
      subtotal,
      tax,
      shipping,
      discount: 0,
      total
    },
    status: 'pending',
    shipping: {
      address: shippingAddress,
      method: 'standard'
    },
    payment: {
      method: paymentMethod,
      status: 'pending'
    },
    notes: {
      customer: notes || ''
    }
  });

  // Log activity
  await Activity.createActivity(
    req.user._id,
    'order_placed',
    'Order placed',
    `Order ${order.orderNumber} placed with ${retailer.name}`,
    { ipAddress: req.ip, userAgent: req.get('User-Agent') },
    { type: 'order', id: order._id }
  );

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.pricing.total,
      itemCount: order.items.length
    }
  });
}));

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
router.put('/:id/status', protect, asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  const order = await Order.findOne({
    orderNumber: req.params.id,
    user: req.user._id,
    isActive: true
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Update order status
  await order.updateStatus(status, note, req.user.name);

  // Log activity
  await Activity.createActivity(
    req.user._id,
    'order_updated',
    'Order status updated',
    `Order ${order.orderNumber} status changed to ${status}`,
    { ipAddress: req.ip, userAgent: req.get('User-Agent') },
    { type: 'order', id: order._id }
  );

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: {
      orderNumber: order.orderNumber,
      status: order.status,
      timeline: order.timeline
    }
  });
}));

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findOne({
    orderNumber: req.params.id,
    user: req.user._id,
    isActive: true
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if order can be cancelled
  if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: `Order cannot be cancelled. Current status: ${order.status}`
    });
  }

  // Cancel order
  await order.updateStatus('cancelled', reason || 'Cancelled by customer', req.user.name);

  // Log activity
  await Activity.createActivity(
    req.user._id,
    'order_cancelled',
    'Order cancelled',
    `Order ${order.orderNumber} cancelled: ${reason || 'No reason provided'}`,
    { ipAddress: req.ip, userAgent: req.get('User-Agent') },
    { type: 'order', id: order._id }
  );

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: {
      orderNumber: order.orderNumber,
      status: order.status
    }
  });
}));

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
router.get('/stats/overview', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { period = 'month' } = req.query;

  // Calculate date range
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

  // Get order statistics
  const orders = await Order.find({
    user: userId,
    createdAt: { $gte: startDate, $lte: now },
    isActive: true
  });

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.pricing.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  // Status breakdown
  const statusBreakdown = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  // Top retailers
  const retailerStats = await Order.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: startDate, $lte: now },
        isActive: true
      }
    },
    {
      $group: {
        _id: '$retailer',
        orderCount: { $sum: 1 },
        totalSpent: { $sum: '$pricing.total' }
      }
    },
    {
      $lookup: {
        from: 'retailers',
        localField: '_id',
        foreignField: '_id',
        as: 'retailer'
      }
    },
    {
      $unwind: '$retailer'
    },
    {
      $sort: { totalSpent: -1 }
    },
    {
      $limit: 5
    }
  ]);

  res.json({
    success: true,
    data: {
      totalOrders,
      totalSpent,
      averageOrderValue,
      statusBreakdown,
      topRetailers: retailerStats.map(stat => ({
        name: stat.retailer.name,
        orderCount: stat.orderCount,
        totalSpent: stat.totalSpent
      }))
    }
  });
}));

module.exports = router;
