import { Router } from "express";
import orderModel from "../models/Order";

const router = Router();


// api/orders
router.get("/orders", async (req, res) => {
    try {
        const orders = await orderModel.find();
        res.status(201).json(orders);
    } catch (err: any) {
        res.status(500).json({error: err.message})
    }
})


// api/order
router.post("/order", async (req, res) => {
    const {userID, amount, status} = req.body;
    if (!(userID&&amount&&status)) {
        return res.status(400).json({err: "Missing required fields!"});
    }
    try {
        const order = new orderModel(userID, amount, status);
        await order.save();
        res.status(201).json(order);
    } catch(err: any) {
        res.status(500).json({error: err.message});
    }
})


export default router;