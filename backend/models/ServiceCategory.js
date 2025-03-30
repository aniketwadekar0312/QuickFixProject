const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: {
      type: String, required:true
    },
    services: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
