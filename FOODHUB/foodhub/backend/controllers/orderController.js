const Product = require("../models/Product");
const User = require("../models/User");
const Cart = require("../models/Cart");

exports.bookOrder = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ msg: "Product not found" });
    }

    // Check if there is enough stock, but do not deduct stock
    if (product.quantity + quantity < quantity) {
      return res.status(400).json({ msg: "Not enough stock" });
    }

    // Store user order on product document (No stock deduction here)
    product.orders.push({
      user: req.user.id, // Store user ID
      quantity,
      date: new Date(), // Store the date of the order
    });

    await product.save(); // Save the product with the new order

    const user = await User.findById(req.user.id);
    user.orderHistory.push({
      product: product._id,
      quantity,
      date: new Date(),
      productSnapshot: {
        name: product.name,
        price: product.price,
        image: product.image,
      },
    });

    await user.save(); // Save the user’s order history

    // Remove item from cart after successful booking (No stock deduction)
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.products = cart.products.filter(
        (item) => item.productId.toString() !== productId
      );
      await cart.save();
    }

    res.json({ msg: "Order booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error booking order" });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "orderHistory.product"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user.orderHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching order history" });
  }
};
