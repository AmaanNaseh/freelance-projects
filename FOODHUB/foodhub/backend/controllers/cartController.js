const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add item to cart
exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send("Product not found");

    // Check if the quantity requested is greater than the available stock
    if (product.quantity < quantity) {
      return res.status(400).json({ msg: "Not enough stock available" });
    }

    // Find user's cart, if it exists, otherwise create a new cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [
          { productId, name: product.name, price: product.price, quantity },
        ],
      });
    } else {
      // If product already exists in the cart, update the quantity
      const existingProduct = cart.products.find(
        (item) => item.productId.toString() === productId
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({
          productId,
          name: product.name,
          price: product.price,
          quantity,
        });
      }
    }

    // Save the cart to the database
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding to cart");
  }
};

// Reject item from cart
// cartController.js
exports.rejectItem = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(400).json({ msg: "Cart not found" });
    }

    // Find the product to restore its stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ msg: "Product not found" });
    }

    // Restore the product's stock by adding back the rejected quantity
    product.quantity += quantity;
    await product.save();

    // Remove the rejected item from the cart
    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    res.json({ msg: "Item removed from cart and stock restored" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error rejecting item" });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "products.productId"
    );
    if (!cart) return res.status(404).send("Cart not found");
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching cart");
  }
};
