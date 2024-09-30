import { Router } from "express";

const router = Router();
import * as adminController from "../controllers/admin.js";
import adminMiddleware from "../middelwares/isAdmin.js";
import authMiddleware from "../middelwares/auth.js";

// get all products
// GET /admin/products
router.get(
  "/products",
  authMiddleware,
  adminMiddleware,
  adminController.getAllProducts,
);

// approve product
// POST /admin/product-approve/:id
router.post(
  "/product-approve/:id",
  authMiddleware,
  adminMiddleware,
  adminController.approveProduct,
);

// reject product
// POST /admin/product-reject/:id
router.post(
  "/product-reject/:id",
  authMiddleware,
  adminMiddleware,
  adminController.rejectProduct,
);

// rollback product
// POST /admin/product-rollback/:id
router.post(
  "/product-rollback/:id",
  authMiddleware,
  adminMiddleware,
  adminController.rollbackProduct,
);

// get user list
// GET /admin/users
router.get("/users", authMiddleware, adminMiddleware, adminController.getUsers);

// ban user
// POST /admin/user-ban/:id
router.post(
  "/user-ban/:id",
  authMiddleware,
  adminMiddleware,
  adminController.banUser,
);

// unban user
// POST /admin/user-unban/:id
router.post(
  "/user-unban/:id",
  authMiddleware,
  adminMiddleware,
  adminController.unbanUser,
);

export default router;
