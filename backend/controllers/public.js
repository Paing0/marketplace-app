import Product from "../models/Product.js";

export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find({ status: "approve" }).sort({
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
