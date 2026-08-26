const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  bookOrder,
  getOrderHistory,
} = require("../controllers/orderController");

router.post("/book", verifyToken, bookOrder);
router.get("/history", verifyToken, getOrderHistory);

module.exports = router;
