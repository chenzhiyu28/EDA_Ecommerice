import { Router } from "express";
import orderModel from "../models/Order";
import { failure, success } from "../utils/response";

const router = Router();


// Get api/orders
router.get("/orders", async (req, res) => {
    try {
        const orders = await orderModel.find();
        return success(res, orders, 200);
    } catch (err: any) {
        return failure(res, err.message, 500);
    }
})


// Post api/order
router.post("/order", async (req, res) => {
    const {userID, amount, status} = req.body;
    if (!(userID&&amount&&status)) {
        return res.status(400).json({err: "Missing required fields!"});
    }
    try {
        const order = new orderModel({userID, amount, status});
        await order.save();
        return success(res, order, 201);
    } catch(err: any) {
        return failure(res, err.message, 500)
    }
})


export default router;