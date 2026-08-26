const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Add item to cart
router.post("/add", cartController.addToCart);

// Reject item from cart
router.post("/reject", cartController.rejectItem);

// Get user's cart
router.get("/:userId", cartController.getCart);

module.exports = router;
