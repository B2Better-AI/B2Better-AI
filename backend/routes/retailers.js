const express = require('express');
const Retailer = require('../models/Retailer');
const Product = require('../models/Product');
const { protect, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all retailers with search and filters
// @route   GET /api/retailers
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const {
    search,
    category,
    sortBy = 'rating',
    page = 1,
    limit = 12,
    verified,
    minRating
  } = req.query;

  // Build query
  const query = { isActive: true };

  // Search functionality
  if (search) {
    query.$text = { $search: search };
  }

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Verified filter
  if (verified === 'true') {
    query.verified = true;
  }

  // Minimum rating filter
  if (minRating) {
    query['rating.average'] = { $gte: parseFloat(minRating) };
  }

  // Build sort object
  let sort = {};
  switch (sortBy) {
    case 'rating':
      sort = { 'rating.average': -1, 'rating.count': -1 };
      break;
    case 'name':
      sort = { name: 1 };
      break;
    case 'products':
      sort = { 'products.total': -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    default:
      sort = { 'rating.average': -1 };
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const retailers = await Retailer.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-reviews -__v');

  // Get total count for pagination
  const total = await Retailer.countDocuments(query);

  // Format response
  const formattedRetailers = retailers.map(retailer => ({
    id: retailer._id,
    name: retailer.name,
    category: retailer.category,
    rating: retailer.rating.average,
    reviews: retailer.rating.count,
    location: `${retailer.location.city}, ${retailer.location.state}`,
    established: retailer.established,
    products: retailer.products.total,
    responseTime: retailer.responseTime,
    image: '💻', // Placeholder
    verified: retailer.verified,
    specialties: retailer.specialties,
    description: retailer.description
  }));

  res.json({
    success: true,
    data: formattedRetailers,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
      limit: parseInt(limit)
    }
  });
}));

// @desc    Get single retailer
// @route   GET /api/retailers/:id
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const retailer = await Retailer.findById(req.params.id)
    .populate('reviews.user', 'name avatar')
    .select('-__v');

  if (!retailer || !retailer.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Retailer not found'
    });
  }

  // Get retailer's products
  const products = await Product.find({ 
    retailer: retailer._id, 
    status: 'active',
    isActive: true 
  })
    .sort({ featured: -1, 'rating.average': -1 })
    .limit(10)
    .select('name description pricing rating images category');

  res.json({
    success: true,
    data: {
      ...retailer.getPublicProfile(),
      products: products.map(product => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.getCurrentPrice(),
        rating: product.rating.average,
        image: product.images[0]?.url || '📦',
        category: product.category
      }))
    }
  });
}));

// @desc    Add review to retailer
// @route   POST /api/retailers/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }

  const retailer = await Retailer.findById(req.params.id);
  if (!retailer || !retailer.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Retailer not found'
    });
  }

  // Check if user has ordered from this retailer
  const hasOrdered = await Order.findOne({
    user: req.user._id,
    retailer: retailer._id
  });

  if (!hasOrdered) {
    return res.status(400).json({
      success: false,
      message: 'You must have ordered from this retailer to leave a review'
    });
  }

  // Add review
  await retailer.addReview(req.user._id, rating, comment);

  res.json({
    success: true,
    message: 'Review added successfully'
  });
}));

// @desc    Get retailer reviews
// @route   GET /api/retailers/:id/reviews
// @access  Public
router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const retailer = await Retailer.findById(req.params.id)
    .populate({
      path: 'reviews.user',
      select: 'name avatar'
    })
    .select('reviews');

  if (!retailer || !retailer.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Retailer not found'
    });
  }

  // Paginate reviews
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const reviews = retailer.reviews
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(skip, skip + parseInt(limit));

  res.json({
    success: true,
    data: reviews,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(retailer.reviews.length / parseInt(limit)),
      total: retailer.reviews.length,
      limit: parseInt(limit)
    }
  });
}));

// @desc    Get retailer products
// @route   GET /api/retailers/:id/products
// @access  Public
router.get('/:id/products', asyncHandler(async (req, res) => {
  const {
    category,
    sortBy = 'rating',
    page = 1,
    limit = 12,
    minPrice,
    maxPrice
  } = req.query;

  // Build query
  const query = { 
    retailer: req.params.id,
    status: 'active',
    isActive: true
  };

  if (category && category !== 'all') {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query['pricing.basePrice'] = {};
    if (minPrice) query['pricing.basePrice'].$gte = parseFloat(minPrice);
    if (maxPrice) query['pricing.basePrice'].$lte = parseFloat(maxPrice);
  }

  // Build sort object
  let sort = {};
  switch (sortBy) {
    case 'rating':
      sort = { 'rating.average': -1 };
      break;
    case 'price_low':
      sort = { 'pricing.basePrice': 1 };
      break;
    case 'price_high':
      sort = { 'pricing.basePrice': -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'name':
      sort = { name: 1 };
      break;
    default:
      sort = { 'rating.average': -1 };
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .select('-reviews -__v');

  // Get total count
  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    data: products.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.getCurrentPrice(),
      originalPrice: product.pricing.basePrice,
      isOnSale: product.pricing.isOnSale,
      rating: product.rating.average,
      reviewCount: product.rating.count,
      image: product.images[0]?.url || '📦',
      category: product.category,
      inStock: product.isInStock()
    })),
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
      limit: parseInt(limit)
    }
  });
}));

// @desc    Get categories for filtering
// @route   GET /api/retailers/categories
// @access  Public
router.get('/meta/categories', asyncHandler(async (req, res) => {
  const categories = await Retailer.distinct('category', { isActive: true });
  
  res.json({
    success: true,
    data: categories
  });
}));

module.exports = router;
