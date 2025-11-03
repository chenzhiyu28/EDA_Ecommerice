import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { success } from './utils/response';
import productRouter from './routes/productRoutes';
import { connectProducer } from './kafka'; // <-- 1. Import connectProducer

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// --- MongoDB Connection ---
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/product-service";
mongoose.connect(MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected")) // <-- Removed placeholder text
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Connect Kafka Producer ---
connectProducer(); // <-- 2. Call connectProducer on startup
// ----------------------------

// --- Routes ---
app.get("/hello", (req: Request, res: Response) => {
    return success(res, "Welcome to Product Service!");
});
app.use("/api/products", productRouter);
// ----------------

// Get port from environment or default to 3002
const PORT = process.env.PORT || 3002;

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Product Server is running on http://localhost:${PORT}`);
    console.log(`👉 Try visiting: http://localhost:${PORT}/hello`);
    console.log(`🌿 Environment: ${process.env.NODE_ENV}`);
});