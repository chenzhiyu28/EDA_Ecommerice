import express from "express"
import orderRouter from "./routes/orderRoutes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { success } from "./utils/response";
import { connectProducer, runConsumer } from "./kafka"; // <--- 导入运行函数

// load env variable
dotenv.config();

// init 
const app = express();
app.use(express.json())

// MongoDB
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://order-db:27017/order-service") // <--- 确认这里指向 docker 服务名
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));


// Kafka
runConsumer();
connectProducer();

// router
app.use("/api", orderRouter)
app.get("/hello", (req, res)=> {
    return success(res, "welcome to order service!")
})


// activate app
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`👉 Try visiting: http://localhost:${PORT}/hello`);
    console.log(`🌿 Environment: ${process.env.NODE_ENV}`)
});