import { validationResult } from "express-validator";
import Product from "../models/Product.js";
import SavedProduct from "../models/SavedProduct.js";

import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: "dy3ovuxx9",
  api_key: "816312852193528",
  api_secret: process.env.CLOUD_API,
});

export const addNewProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
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

    if (product.images && Array.isArray(product.images)) {
      const deletePromise = product.images.map((img) => {
        const publicId = img.substring(
          img.lastIndexOf("/") + 1,
          img.lastIndexOf("."),
        );
        return new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(publicId, (err, result) => {
            if (err) {
              reject(new Error("Destroy Failed"));
            } else {
              resolve(result);
            }
          });
        });
      });
      await Promise.all(deletePromise);
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

export const uploadProductImage = async (req, res) => {
  const productImages = req.files;
  const productId = req.body.product_id;
  let secureUrlArray = [];

  const product = await Product.findOne({ _id: productId });
  if (req.userId.toString() !== product.seller.toString()) {
    throw new Error("Authorization Failed.");
  }

  try {
    productImages.forEach((img) => {
      cloudinary.uploader.upload(img.path, async (err, result) => {
        if (!err) {
          const url = result.secure_url;
          secureUrlArray.push(url);
          if (productImages.length === secureUrlArray.length) {
            await Product.findByIdAndUpdate(productId, {
              $push: { images: secureUrlArray },
            });
            return res.status(200).json({
              isSuccess: true,
              message: "Product images saved",
              secureUrlArray,
            });
          }
        } else {
          throw new Error("Cloud upload failed");
        }
      });
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const getSavedImages = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).select("images seller");

    if (req.userId.toString() !== product.seller.toString()) {
      throw new Error("Authorization Failed.");
    }

    if (!product) {
      throw new Error("Product not found");
    }
    return res.status(200).json({
      isSuccess: true,
      message: "Product images are fetched",
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const deleteProductImages = async (req, res) => {
  try {
    const productId = req.params.productId;
    const decodeImgToDelete = decodeURIComponent(req.params.imgToDelete);
    await Product.findByIdAndUpdate(productId, {
      $pull: { images: decodeImgToDelete },
    });
    const publicId = decodeImgToDelete.substring(
      decodeImgToDelete.lastIndexOf("/") + 1,
      decodeImgToDelete.lastIndexOf("."),
    );
    await cloudinary.uploader.destroy(publicId);
    return res.status(200).json({
      isSuccess: true,
      message: "Image deleted",
    });
  } catch (err) {
    return res.status(500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

export const savedProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const isExists = await SavedProduct.findOne({
      $and: [{ user_id: req.userId }, { product_id: id }],
    });

    if (isExists) {
      throw new Error("Product already saved");
    }

    await SavedProduct.create({
      user_id: req.userId,
      product_id: id,
    });
    return res.status(200).json({
      isSuccess: true,
      message: "Product Saved.",
    });
  } catch (error) {
    return res.status(401).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

export const getSavedProducts = async (req, res) => {
  try {
    const products = await SavedProduct.find({
      user_id: req.userId,
    }).populate("product_id", "name category images description price");
    //if (!products || products.length === 0) {
    //  throw new Error("No products are not saved yet.");
    //}
    return res.status(200).json({
      isSuccess: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

export const unSavedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await SavedProduct.findOneAndDelete({ product_id: id });
    return res.status(200).json({
      isSuccess: true,
      message: "Product removed from the list.",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
