const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'profile_update',
      'order_placed',
      'order_updated',
      'order_cancelled',
      'supplier_added',
      'supplier_removed',
      'product_viewed',
      'product_reviewed',
      'settings_updated',
      'password_changed',
      'email_verified',
      'account_created'
    ]
  },
  action: {
    type: String,
    required: true,
    maxlength: [100, 'Action cannot be more than 100 characters']
  },
  details: {
    type: String,
    maxlength: [500, 'Details cannot be more than 500 characters']
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    device: String,
    browser: String,
    os: String
  },
  relatedEntity: {
    type: {
      type: String,
      enum: ['order', 'retailer', 'product', 'user']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for queries
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ 'relatedEntity.type': 1, 'relatedEntity.id': 1 });
activitySchema.index({ createdAt: -1 });

// Static method to create activity
activitySchema.statics.createActivity = function(userId, type, action, details = '', metadata = {}, relatedEntity = null) {
  return this.create({
    user: userId,
    type,
    action,
    details,
    metadata,
    relatedEntity
  });
};

// Get user activities with pagination
activitySchema.statics.getUserActivities = function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  return this.find({ user: userId, isVisible: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('relatedEntity.id', 'name orderNumber')
    .lean();
};

module.exports = mongoose.model('Activity', activitySchema);
