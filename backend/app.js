import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import multer from "multer";

// routes imports
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import adminRoutes from "./routes/admin.js";

const storageConfigure = multer.diskStorage({
  filename: (_req, file, cb) => {
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, suffix + "-" + file.originalname);
  },
});
const filterConfigure = (_req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, undefined);
  }
};

const app = express();

// Global middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(
  multer({ storage: storageConfigure, fileFilter: filterConfigure }).array(
    "product_images",
  ),
);

// routes
app.use(authRoutes);
app.use(productRoutes);
app.use("/admin", adminRoutes);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Start the server
    app.listen(8080, () => {
      console.log("Server is running at port: 8080");
    });
  } catch (error) {
    // Handle any errors during connection or server startup
    console.error("Failed to start server:", error);
    process.exit(1); // Exit the process with failure
  }
};

// Start the server
startServer();
