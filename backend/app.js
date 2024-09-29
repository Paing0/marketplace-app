import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

// routes imports
import authRoutes from "./routes/auth.js";

const app = express();

// Global middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));

// routes
app.use(authRoutes);

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
