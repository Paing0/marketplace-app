import { Router } from "express";
import { body } from "express-validator";

import * as authController from "../controllers/auth.js";

const router = Router();

// create new user
// POST -> /register
router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must have at least 3 characters."),
    body("email").trim().notEmpty().withMessage("Please enter a valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must have at least 6 characters."),
  ],
  authController.register,
);

// login user
// POST -> /login
router.post(
  "/login",
  [
    body("email").trim().isEmail().withMessage("Please enter a valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must have at least 6 characters."),
  ],
  authController.login,
);

export default router;
