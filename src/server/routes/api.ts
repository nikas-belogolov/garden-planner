import express from 'express';
import plants from './plants.json'

const router = express.Router();

router.get("/plants", (req, res) => {
    res.json(plants)
    // res.sendFile("./plants.json");
})

export default router;