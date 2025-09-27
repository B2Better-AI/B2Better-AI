const mongoose = require('mongoose');

const retailerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Retailer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Office Supplies', 'Industrial', 'Sustainability', 'Fashion', 'Home & Garden', 'Sports']
  },
  specialties: [{
    type: String,
    trim: true,
    maxlength: [50, 'Specialty cannot be more than 50 characters']
  }],
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true
    }
  },
  contact: {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
    }
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: [500, 'Review cannot be more than 500 characters'] },
    createdAt: { type: Date, default: Date.now }
  }],
  products: {
    total: { type: Number, default: 0 },
    active: { type: Number, default: 0 }
  },
  responseTime: {
    type: String,
    default: '< 4 hours'
  },
  established: {
    type: String,
    required: [true, 'Established year is required']
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationDate: {
    type: Date
  },
  businessInfo: {
    taxId: String,
    licenseNumber: String,
    businessType: {
      type: String,
      enum: ['Corporation', 'LLC', 'Partnership', 'Sole Proprietorship', 'Other']
    }
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  stats: {
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    customerCount: { type: Number, default: 0 },
    lastOrderDate: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Update average rating when reviews change
retailerSchema.methods.updateRating = function() {
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
retailerSchema.methods.addReview = async function(userId, rating, comment) {
  // Check if user already reviewed
  const existingReview = this.reviews.find(review => review.user.toString() === userId.toString());
  if (existingReview) {
    throw new Error('User has already reviewed this retailer');
  }

  this.reviews.push({
    user: userId,
    rating,
    comment
  });

  await this.updateRating();
  return this;
};

// Get public profile
retailerSchema.methods.getPublicProfile = function() {
  const retailerObject = this.toObject();
  delete retailerObject.businessInfo;
  delete retailerObject.__v;
  return retailerObject;
};

// Index for search
retailerSchema.index({ name: 'text', description: 'text', specialties: 'text' });
retailerSchema.index({ category: 1 });
retailerSchema.index({ 'rating.average': -1 });
retailerSchema.index({ verified: 1 });
retailerSchema.index({ isActive: 1 });

module.exports = mongoose.model('Retailer', retailerSchema);
