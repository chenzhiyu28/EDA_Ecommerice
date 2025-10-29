import express = require("express");
import userRouter from "./routes/userRoutes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectProducer } from "./kafka"; // <--- 导入连接函数

dotenv.config();

// init
const app = express();
app.use(express.json());

// MongoDB
mongoose
    .connect(process.env.MONGODB_URL || "mongodb://user-db:27017/user-service")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));


// --- 连接 Kafka 生产者 ---
connectProducer(); // <--- 在服务器启动前连接生产者
// -------------------------


// router
app.use("/api/users", userRouter)
app.get("/hello", (req, res) => {
    res.send("Hello from Express + TypeScript")
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`👉 Try visiting: http://localhost:${PORT}/hello`);
    console.log(`🌿 Environment: ${process.env.NODE_ENV}`);
});