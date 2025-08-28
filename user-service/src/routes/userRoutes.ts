import e, { Router } from "express";

const router = Router();

//get /api/users/123
router.get("/:id", (req, res) => {
    const {id} = req.params;
    res.json({message: `user with id ${id}:`})
});


//get /api/users/search?name=tom
router.get("/search", (req,res) => {
    const {name} = req.query;
    res.json({message: `Your are searching for ${name}`})
})

router.post("/register", async (req, res) => {
    try {        
        const {username, email, password} = req.body;
        res.status(201).json({username, email, password});
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
});


export default router;