import { Request, Response, Router } from "express";
import userModel, { IUser } from "../models/User";

const router = Router();

// api/users
router.get("/", async (req:Request, res:Response) => {
    try {
        const users:IUser[] = await userModel.find();
        res.status(201).json({users});
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});


// api/users/name
router.get("/:name", async (req, res) => {
    const {name} = req.params;
    
    try {
        const user = await userModel.find({username:`${name}`});
        res.status(200).json(user);
    } catch(err: any) {
        res.status(500).json({error: err.message});
    }
});


// api/users/search?name=tom
router.get("/search", async (req:Request,res:Response) => {
    const {name} = req.query;
    if (!name) {
        return res.status(400).json({error: "no name is contained in your search!"})
    }

    try {
        const user = await userModel.find({username: name});
        res.status(201).json(user);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
})


// api/users/register
router.post("/register", async (req: Request, res:Response) => {
    try {        
        const {username, email, password} = req.body;
        if (!(username&&email&&password)) {
            return res.status(400).json({error: "Missing required fields!"})
        }

        const newUser = new userModel({username, email, password});
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
});


export default router;