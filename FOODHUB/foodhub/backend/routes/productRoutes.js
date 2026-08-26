const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  rejectProduct,
  getPurchasers,
} = require("../controllers/productController");

const { upload } = require("../controllers/productController");

router.post("/", verifyToken, upload.single("image"), createProduct);
router.post("/", verifyToken, createProduct);
router.get("/", getAllProducts);
router.get("/:id/purchasers", verifyToken, getPurchasers);
router.put("/:id", verifyToken, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);
router.get("/admin/my-products", verifyToken, getAdminProducts);
router.put("/reject/:id", verifyToken, rejectProduct);

module.exports = router;
