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
    const productDoc = await Product.create({
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
      productDoc,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};
