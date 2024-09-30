import Product from "../models/Product.js";
import User from "../models/User.js";

export const getAllProducts = async (_req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name")
      .sort({ createdAt: -1 });
    console.log(products);
    return res.status(200).json({
      isSuccess: true,
      products,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const approveProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    product.status = "approve";
    await product.save();
    return res.status(200).json({
      isSuccess: true,
      message: "Product was approved",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const rejectProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    product.status = "reject";
    await product.save();
    return res.status(200).json({
      isSuccess: true,
      message: "Product was rejected",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const rollbackProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    product.status = "pending";
    await product.save();
    return res.status(200).json({
      isSuccess: true,
      message: "Product was rolled back",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const getUsers = async (_req, res) => {
  try {
    const users = await User.find()
      .select("name email role createdAt status")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      isSuccess: true,
      users,
    });
  } catch (err) {
    return res.status(422).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const banUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    user.status = "banned";
    await user.save();
    return res.status(200).json({
      isSuccess: true,
      message: "User was banned",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const unbanUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    user.status = "active";
    await user.save();
    return res.status(200).json({
      isSuccess: true,
      message: "User was unbanned",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};
