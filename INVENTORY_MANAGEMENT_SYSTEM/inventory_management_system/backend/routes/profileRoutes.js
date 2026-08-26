const express = require("express");
const router = express.Router();
const {
  getProfile,
  deleteAccount,
} = require("../controllers/profileController");
const { verifyToken } = require("../middlewares/authMiddleware");

router
  .route("/")
  .get(verifyToken, getProfile)
  .delete(verifyToken, deleteAccount);

module.exports = router;
