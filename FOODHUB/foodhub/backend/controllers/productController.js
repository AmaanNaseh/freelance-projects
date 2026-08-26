const Product = require("../models/Product");
const multer = require("multer");
const storage = multer.memoryStorage();

exports.upload = multer({ storage: storage });

exports.createProduct = async (req, res) => {
  const { name, price, quantity } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ msg: "Image file is required" });

  const product = await Product.create({
    name,
    price,
    quantity,
    image: {
      data: file.buffer,
      contentType: file.mimetype,
    },
    addedBy: req.user.id,
  });

  res.status(201).json(product);
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find().populate("addedBy", "username");
  res.json(products);
};

exports.getPurchasers = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "orders.user",
      "username email"
    );

    if (!product) return res.status(404).json({ msg: "Product not found" });

    res.json({
      name: product.name,
      orders: product.orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch purchasers" });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, price, quantity } = req.body;
  const file = req.file;

  const updatedData = {
    name,
    price,
    quantity,
  };

  if (file) {
    updatedData.image = {
      data: file.buffer,
      contentType: file.mimetype,
    };
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
  });

  res.json(updated);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: "Product deleted" });
};

exports.getAdminProducts = async (req, res) => {
  const products = await Product.find({ addedBy: req.user.id }).populate(
    "addedBy",
    "username"
  );
  res.json(products);
};

// Rejection Logic to Update Product Quantity
exports.rejectProduct = async (req, res) => {
  const { quantity } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ msg: "Product not found" });

  // Increase the stock based on rejected quantity
  product.quantity += quantity;
  await product.save();

  res.json({ msg: "Product quantity updated after rejection" });
};
