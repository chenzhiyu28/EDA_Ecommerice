import { Request, Response, Router } from 'express';
import ProductModel from '../models/Product';
import { success, failure } from '../utils/response';
import { sendMessage } from '../kafka'; // <-- 1. Import sendMessage

const router = Router();

// POST /api/products - Create a new product
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, description, price, stock } = req.body;

        // ... (Validation logic remains the same) ...
        if (!name || price === undefined || stock === undefined) {
            return failure(res, 'Missing required fields: name, price, stock', 400); 
        }
        // ... (Other validation) ...

        const newProduct = new ProductModel({
            name,
            description,
            price,
            stock
        });

        // Save to database
        await newProduct.save();

        // --- Send Kafka Message ---
        // Define the event payload
        const messagePayload = {
            id: newProduct._id,
            name: newProduct.name,
            price: newProduct.price,
            stock: newProduct.stock
        };

        // Send the event to the 'product.created' topic
        // This is "fire and forget" - we don't wait for it to block the response
        sendMessage('product.created', messagePayload); // <-- 2. Call sendMessage
        // --------------------------

        // Return success response to the client
        return success(res, newProduct, 201); 

    } catch (error: any) {
        console.error("Error creating product:", error);
        return failure(res, 'Failed to create product due to an internal error.', 500);
    }
});

// GET /api/products - Get all products
router.get('/', async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find({}).sort({ createdAt: -1 });
        return success(res, products, 200);
    } catch (error: any) {
        console.error("Error fetching products:", error);
        return failure(res, 'Failed to fetch products due to an internal error.', 500);
    }
});

export default router;