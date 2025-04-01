
const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  OTP: {
    type: Number,
    required: true,
  },
},
{
  timestamps: true
}
);

// Add TTL index
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model('OTP', OTPSchema);
