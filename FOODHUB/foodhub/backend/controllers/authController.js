const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // Include role in the JWT payload
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Signup Controller
exports.signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Create new user
    const user = await User.create({ username, email, password, role });

    // Respond with token and user data (including role)
    res.status(201).json({
      token: generateToken(user),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role, // Include role here
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Respond with token and user data (including role)
    res.status(200).json({
      token: generateToken(user),
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role, // Include role here
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
