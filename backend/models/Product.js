const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Office Supplies', 'Industrial', 'Sustainability', 'Fashion', 'Home & Garden', 'Sports']
  },
  subcategory: {
    type: String,
    trim: true
  },
  retailer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer',
    required: true
  },
  pricing: {
    basePrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    currency: { type: String, default: 'USD' },
    isOnSale: { type: Boolean, default: false }
  },
  inventory: {
    quantity: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    trackInventory: { type: Boolean, default: true }
  },
  specifications: {
    brand: String,
    model: String,
    weight: String,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: 'inches' }
    },
    color: String,
    material: String,
    warranty: String
  },
  images: [{
    url: { type: String, required: true },
    alt: String,
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: [100, 'Review title cannot be more than 100 characters'] },
    comment: { type: String, maxlength: [1000, 'Review cannot be more than 1000 characters'] },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  features: [{
    type: String,
    trim: true,
    maxlength: [100, 'Feature cannot be more than 100 characters']
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: String
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'discontinued'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    views: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (!this.seo.slug) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Update average rating when reviews change
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.rating.count = this.reviews.length;
  }
  return this.save();
};

// Add review
productSchema.methods.addReview = async function(userId, rating, title, comment) {
  // Check if user already reviewed
  const existingReview = this.reviews.find(review => review.user.toString() === userId.toString());
  if (existingReview) {
    throw new Error('User has already reviewed this product');
  }

  this.reviews.push({
    user: userId,
    rating,
    title,
    comment,
    verified: true // Assuming verified for now
  });

  await this.updateRating();
  return this;
};

// Get current price
productSchema.methods.getCurrentPrice = function() {
  return this.pricing.isOnSale && this.pricing.salePrice ? this.pricing.salePrice : this.pricing.basePrice;
};

// Check if in stock
productSchema.methods.isInStock = function() {
  if (!this.inventory.trackInventory) return true;
  return this.inventory.quantity > 0;
};

// Get public profile
productSchema.methods.getPublicProfile = function() {
  const productObject = this.toObject();
  delete productObject.__v;
  return productObject;
};

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ retailer: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ status: 1, isActive: 1 });
productSchema.index({ featured: -1, createdAt: -1 });
productSchema.index({ 'pricing.basePrice': 1 });

module.exports = mongoose.model('Product', productSchema);
