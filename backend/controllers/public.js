import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 6;

  try {
    const products = await Product.find({ status: "approve" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalProducts = await Product.find({
      status: "approve",
    }).countDocuments();

    const totalPages = Math.ceil(totalProducts / perPage);

    return res.status(200).json({
      isSuccess: true,
      products,
      totalPages,
      currentPage: page,
      totalProducts,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const getProductsByFilters = async (req, res) => {
  try {
    const { searchKey, category } = req.query;
    const query = {};
    if (searchKey) {
      query.name = { $regex: searchKey, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    const products = await Product.find(query);
    if (!products || products.length === 0) {
      throw new Error("Products not found.");
    }
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
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "email name",
    );
    if (!product) {
      throw new Error("Product not found.");
    }
    return res.status(200).json({
      isSuccess: true,
      product,
    });
  } catch (err) {
    return res.status(404).json({
      isSuccess: false,
      message: err.message,
    });
  }
};
