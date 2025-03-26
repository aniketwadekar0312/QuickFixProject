const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password:{type:String, required: true },
    role: {
      type: String,
      enum: ["customer", "worker", "admin"],
      required: true,
    },
    photoUrl: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    // Worker-Specific Fields (Only applicable if role === "worker")
    services: [{ type: String }], // List of services worker provides
    specializations: [{ type: String }], // Worker expertise
    rating: { type: Number, min: 0, max: 5, default: 0 },
    verified: { type: Boolean, default: false },
    documents: {
      aadhaarCard: { type: String },
      photo: { type: String },
      workImages: [{ type: String }],
    },
    available: { type: Boolean, default: false },
    location: { type: String },
    pricing: {
      type: Map,
      of: Number, // Example: { "Plumbing": 500, "Electrical": 600 }
    },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
