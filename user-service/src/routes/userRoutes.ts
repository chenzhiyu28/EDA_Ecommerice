import { Request, Response, Router } from "express";
import User, { IUser } from "../models/User";

const router = Router();

// api/users
router.get("/", async (req:Request, res:Response) => {
    try {
        const users:IUser[] = await User.find();
        res.status(201).json({users});
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});


// api/users/123
router.get("/:id", (req, res) => {
    const {id} = req.params;
    res.json({message: `user with id ${id}:`})
});


// api/users/search?name=tom
router.get("/search", async (req:Request,res:Response) => {
    const {name} = req.query;
    if (!name) {
        return res.status(400).json({error: "no name is contained in your search!"})
    }

    try {
        const user = await User.find({username: name});
        res.status(201).json(user);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
})


// register
router.post("/register", async (req: Request, res:Response) => {
    try {        
        const {username, email, password} = req.body;
        if (!(username&&email&&password)) {
            return res.status(400).json({error: "Missing required fields!"})
        }

        const newUser = new User({username, email, password});
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
});


export default router;