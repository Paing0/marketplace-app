import { validationResult } from "express-validator";
import Product from "../models/Product.js";

export const addNewProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      isSuccess: false,
      message: errors.array(),
    });
  }

  const {
    product_name,
    product_description,
    product_price,
    product_category,
    product_used_for,
    product_details,
  } = req.body;

  try {
    const product = await Product.create({
      name: product_name,
      description: product_description,
      price: product_price,
      category: product_category,
      usedFor: product_used_for,
      details: product_details,
      seller: req.userId,
    });

    return res.status(201).json({
      isSuccess: true,
      message: "Product successfully added to the sell list",
      product,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.userId }).sort({
      createdAt: -1,
    });
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

export const getOldProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({
        isSuccess: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      product,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      isSuccess: false,
      message: errors.array(),
    });
  }
  try {
    const {
      product_name,
      product_description,
      product_price,
      product_category,
      product_used_for,
      product_details,
      seller_id,
      product_id,
    } = req.body;

    if (req.userId.toString() !== seller_id) {
      return res.status(403).json({
        isSuccess: false,
        message: "Authorization failed",
      });
    }

    const product = await Product.findOne({ _id: product_id });
    if (!product) {
      return res.status(404).json({
        isSuccess: false,
        message: "Product not found",
      });
    }

    product.name = product_name;
    product.category = product_category;
    product.price = product_price;
    product.description = product_description;
    product.usedFor = product_used_for;
    product.details = product_details;
    await product.save();

    return res.status(200).json({
      isSuccess: true,
      message: "Product details are updated",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({
        isSuccess: false,
        message: "Product not found",
      });
    }

    if (req.userId.toString() !== product.seller.toString()) {
      return res.status(403).json({
        isSuccess: false,
        message: "Authorization failed",
      });
    }

    await Product.findByIdAndDelete(id);
    return res.status(200).json({
      isSuccess: true,
      message: "Product deleted",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};
