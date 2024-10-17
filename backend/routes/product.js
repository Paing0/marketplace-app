import { Router } from "express";
import { body } from "express-validator";
import authMiddleware from "../middelwares/auth.js";
import * as bidController from "../controllers/bid.js";
import * as notificationController from "../controllers/notification.js";

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
      .withMessage("Product usage time is required"),
    body("product_details")
      .isArray()
      .withMessage("Product details must be an array"),
  ],
  productController.addNewProduct,
);

// get all products
// GET /products
router.get("/products", authMiddleware, productController.getAllProducts);

// get single product
// GET /products/:id
router.get("/products/:id", authMiddleware, productController.getOldProduct);

// update product
// POST /update-product
router.post(
  "/update-product",
  authMiddleware,
  [
    body("product_name")
      .trim()
      .notEmpty()
      .withMessage("product name is required."),
    body("product_description")
      .trim()
      .notEmpty()
      .withMessage("product description is required"),
    body("product_price")
      .trim()
      .notEmpty()
      .withMessage("product price is required"),
    body("product_category")
      .trim()
      .notEmpty()
      .withMessage("product category is required"),
    body("product_used_for")
      .trim()
      .notEmpty()
      .withMessage("product usge time is required"),
    body("product_details")
      .isArray()
      .withMessage("product details must be an array."),
  ],
  productController.updateProduct,
);

// delete product
// DELETE /products/:id
router.delete("/products/:id", authMiddleware, productController.deleteProduct);

// upload product image
// POST /upload
router.post("/upload", authMiddleware, productController.uploadProductImage);

// get saved product images
// GET /product-images/:id
router.get(
  "/product-images/:id",
  authMiddleware,
  productController.getSavedImages,
);

// delete product image
// DELETE /products/images/destroy/:productId/:imgToDelete
router.delete(
  "/products/images/destroy/:productId/:imgToDelete",
  authMiddleware,
  productController.deleteProductImages,
);

// save product
// POST /saved-products/:id
router.post(
  "/saved-products/:id",
  authMiddleware,
  productController.savedProduct,
);

// get save products
// GET /saved-products
router.get(
  "/saved-products",
  authMiddleware,
  productController.getSavedProducts,
);

// delete saved product
// DELETE /unsaved-products/:id
router.delete(
  "/unsaved-products/:id",
  authMiddleware,
  productController.unSavedProduct,
);

// save new bid
// POST /add-bid
router.post(
  "/add-bid",
  [
    body("message").trim().notEmpty().withMessage("Message name is required"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
  ],
  authMiddleware,
  bidController.savedNewBid,
);

// get all bids
// GET /bids/:product_id
router.get("/bids/:product_id", bidController.getAllBids);

// push noti
// POST /notify
router.post("/notify", authMiddleware, notificationController.pushNofification);

// get noti
// GET /notifications
router.get(
  "/notifications",
  authMiddleware,
  notificationController.getNotifications,
);

// make noti as read
// GET /notifications-read/:id
router.get(
  "/notifications-read/:id",
  authMiddleware,
  notificationController.markAsRead,
);

// delete noti
// DELETE /notification-delete/:id
router.delete(
  "/notification-delete/:id",
  authMiddleware,
  notificationController.deleteNoti,
);

// delete all noti
// DELETE /notification-delete-all
router.delete(
  "/notification-delete-all",
  authMiddleware,
  notificationController.deleteAllNoti,
);

export default router;
