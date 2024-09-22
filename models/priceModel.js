const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
      enum: ["US", "EU"],
    },
    usd: {
      type: String,
      required: true,
    },
    ves: {
      type: String,
      required: true,
    },
    cop: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Price", priceSchema);
