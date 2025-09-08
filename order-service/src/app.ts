// import express = require("express");

import express from "express"
import orderRouter from "./routes/orderRoutes";
import mongoose from "mongoose";


// init 
const app = express();
app.use(express.json())

// MongoDB
mongoose
    .connect("mongodb://127.0.0.1:27017/order-service")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));


// router
app.use("/api", orderRouter)
app.get("/hello", (req, res)=> {
    res.status(201).send("Welcome to order service.")
})


// activate app
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`👉 Try visiting: http://localhost:${PORT}/hello`);
});