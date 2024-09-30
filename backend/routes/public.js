import { Router } from "express";
import * as publicController from "../controllers/public.js";

const router = Router();

// get all product
// GET /api/products
router.get("/products", publicController.getProducts);

export default router;
