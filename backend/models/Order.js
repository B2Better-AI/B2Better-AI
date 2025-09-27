const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  retailer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Retailer',
    required: true
  },
  items: [{
    product: {
      name: { type: String, required: true },
      description: String,
      category: String,
      sku: String
    },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 }
  }],
  pricing: {
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  shipping: {
    address: {
      name: { type: String, required: true },
      company: String,
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    method: { type: String, default: 'standard' },
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'check', 'paypal', 'stripe'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  notes: {
    customer: String,
    internal: String
  },
  timeline: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: { type: String, default: 'system' }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${timestamp}${random}`;
  }
  next();
});

// Add status to timeline when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      note: `Order status changed to ${this.status}`
    });
  }
  next();
});

// Calculate total price
orderSchema.methods.calculateTotal = function() {
  this.pricing.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.pricing.total = this.pricing.subtotal + this.pricing.tax + this.pricing.shipping - this.pricing.discount;
  return this;
};

// Update order status
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = 'system') {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    note,
    updatedBy
  });
  return this.save();
};

// Get order summary
orderSchema.methods.getSummary = function() {
  return {
    orderNumber: this.orderNumber,
    status: this.status,
    total: this.pricing.total,
    itemCount: this.items.length,
    createdAt: this.createdAt,
    retailer: this.retailer
  };
};

// Index for queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ retailer: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
