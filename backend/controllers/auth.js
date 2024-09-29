import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      isSuccess: false,
      message: errors.array(),
    });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        isSuccess: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    await User.create({
      email,
      name,
      password: hashedPassword,
    });

    // Success response
    return res.status(201).json({
      isSuccess: true,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  // Validate incoming request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      isSuccess: false,
      message: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        isSuccess: false,
        message: "Email does not exist",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid password",
      });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      isSuccess: true,
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
