const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  image: {
    data: Buffer,
    contentType: String,
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orders: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user
      quantity: Number,
      date: { type: Date, default: Date.now }, // Timestamp of the order
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
