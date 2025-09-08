import { Request, Response, Router } from "express";
import userModel, { IUser } from "../models/User";
import { failure, success } from "../utils/response";
import { fail } from "assert";

const router = Router();

// Get api/users
router.get("/", async (req:Request, res:Response) => {
    try {
        const users:IUser[] = await userModel.find();
        return success(res, users, 200);
    } catch (err: any) {
        return failure(res, err.message, 500);
    }
});


// Get api/users/name
router.get("/:name", async (req, res) => {
    const {name} = req.params;
    
    try {
        const user = await userModel.find({username:`${name}`});
        return success(res, user, 200);
    } catch(err: any) {
        return failure(res, err.message, 500);
    }
});


// Get api/users/search?name=tom
router.get("/search", async (req:Request,res:Response) => {
    const {name} = req.query;
    if (!name) {
        return res.status(400).json({error: "no name is contained in your search!"})
    }

    try {
        const user = await userModel.find({username: name});
        return success(res, user, 200);
    } catch (err: any) {
        return failure(res, err.message, 500);
    }
})


// api/users/register
router.post("/register", async (req: Request, res:Response) => {
    try {        
        const {username, email, password} = req.body;
        if (!(username&&email&&password)) {
            return failure(res, "missing required fields!", 400);
        }

        const newUser = new userModel({username, email, password});
        await newUser.save();
        return success(res, newUser, 201);
    } catch (error: any) {
        return failure(res, error.message, 500);
    }
});


export default router;