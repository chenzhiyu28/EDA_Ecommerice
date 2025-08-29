import express = require("express");
import userRouter from "./routes/userRoutes";
import mongoose from "mongoose";

// init
const app = express();
app.use(express.json());

// MongoDB
mongoose
    .connect("mongodb://127.0.0.1:27017/game")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));



// router
app.use("/api/users", userRouter)
app.get("/hello", (req, res) => {
    res.send("Hello from Express + TypeScript")
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`👉 Try visiting: http://localhost:${PORT}/hello`);
});