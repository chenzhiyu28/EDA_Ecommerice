import { Router } from "express";
import orderModel from "../models/Order";
import UserCacheModel from "../models/UserCache";
import ProductCacheModel from "../models/ProductCache";
import { failure, success } from "../utils/response";
import { sendMessage } from "../kafka";

const router = Router();

// get all routers
// Get api/orders
router.get("/orders", async (req, res) => {
    try {
        const orders = await orderModel.find();
        return success(res, orders, 200);
    } catch (err: any) {
        return failure(res, err.message, 500);
    }
})


// create order (producer msg + product cache)
// Post api/order
router.post("/order", async (req, res) => {
    
    const { userID, productID, quantity } = req.body;

    if (!userID || !productID || !quantity) {
        return failure(res, "Missing required fields: userID, productID, quantity", 400);
    } else if (typeof quantity !== 'number' || quantity <= 0) {
         return failure(res, "Quantity must be a positive number", 400);
    }
    
    try {
        const user = await UserCacheModel.findById(userID);
        if (!user) {
            return failure(res, "User not found", 404);
        }

        const product = await ProductCacheModel.findById(productID);
        if (!product) {
            return failure(res, "Product not found", 404);
        }

        // business logic: 
        // stock check
        if (product.stock < quantity) {
            return failure(res, `Insufficient stock for ${product.name}. Only ${product.stock} left.`, 400);
        }
        
        // price 
        const totalAmount = product.price * quantity;

        // create order in DB cache (autonomy)
        const newOrder = new orderModel({
            userID: user._id, //user._id 是 string, 而 OrderSchema 中是 ObjectId, Mongoose 会自动处理转换
            amount: totalAmount,
            status: "pending" // "pending" by default
        });

        await newOrder.save();

        const messagePayload = {
            orderID: newOrder._id,
            productID: productID,
            quantity: quantity,
        };
        sendMessage("order.created", messagePayload);

        return success(res, newOrder, 201);

    } catch (err: any) {
        console.error("Error creating order:", err);
        return failure(res, "Internal server error while creating order", 500);
    }
});


// cached users
// Get api/cachedUsers
router.get("/cachedUsers", async (req, res) => {
    try {
        const cachedUsers = await UserCacheModel.find();
        return success(res, cachedUsers, 200);
    } catch (err: any) {
        return failure(res, err.message, 500);
    }
})

// cached users
// Get api/cachedProducts
router.get("/cachedProducts", async (req, res) => {
    try {
        const cachedProducts = await ProductCacheModel.find();
        return success(res, cachedProducts, 200);
    } catch (err: any) {
        return failure(res, err.message, 500);
    }
})



export default router;