// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;

    // Check if a user already exists with either username or email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with email included
    const newUser = new User({ username, email, password: hashedPassword, bio });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    // Accept an identifier which can be either email or username
    const { identifier, password } = req.body;

    // Find a user either by username or email matching the identifier
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create a JWT token if login is successful
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
