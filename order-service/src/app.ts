import express = require("express");
import orderRouter from "./routes/orderRoutes";


// init 
const app = express();
app.use(express.json())


// router
app.use("/api", orderRouter)
app.get("/hello", (req, res)=> {
    res.status(200).send("Welcome to order service.")
})


// activate app
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`👉 Try visiting: http://localhost:${PORT}/hello`);
});