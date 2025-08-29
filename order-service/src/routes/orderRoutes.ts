import { Request, Response, Router } from "express";

const router = Router();


// api/orders
router.get("/orders", (req, res) => {
    try {
        res.status(200).send("you are visiting all orders!")
    } catch (err: any) {
        res.status(500).json({error: err.message})
    }
})



export default router;