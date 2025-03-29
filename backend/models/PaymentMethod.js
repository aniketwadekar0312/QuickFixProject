const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['card', 'bank_account'],
    required: true
  },
  last4: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: function() {
      return this.type === 'card';
    }
  },
  expiryMonth: {
    type: Number,
    required: function() {
      return this.type === 'card';
    }
  },
  expiryYear: {
    type: Number,
    required: function() {
      return this.type === 'card';
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  paymentMethodId: {
    type: String,
    required: true
  },
  customerId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one default payment method per user
paymentMethodSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema); 