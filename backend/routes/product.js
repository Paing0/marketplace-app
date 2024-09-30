import { Router } from "express";
import { body } from "express-validator";
import authMiddleware from "../middelwares/auth.js";

import * as productController from "../controllers/product.js";

const router = Router();
// add product
// POST /create-product
router.post(
  "/create-product",
  authMiddleware,
  [
    body("product_name")
      .trim()
      .notEmpty()
      .withMessage("Product name is required"),
    body("product_description")
      .trim()
      .notEmpty()
      .withMessage("Product description is required"),
    body("product_price")
      .trim()
      .notEmpty()
      .withMessage("Product price is required"),
    body("product_category")
      .trim()
      .notEmpty()
      .withMessage("Product category is required"),
    body("product_used_for")
      .trim()
      .notEmpty()
      .withMessage("Product usage information is required"),
    body("product_details")
      .isArray()
      .withMessage("Product details must be an array"),
  ],
  productController.addNewProduct,
);

export default router;
