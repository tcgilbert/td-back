require("dotenv").config();
const express = require("express");
const router = express.Router();

const db = require("../models");

// Get about route GET
router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const about = await db.about.findOne({ where: { userId: userId } });
        res.status(200).json({ about });
    } catch (error) {
        res.status(500).json({
            msg: "Could not find about content",
            error: error,
        });
    }
});

// Update about content PUT
router.put("/update", async (req, res) => {
    console.log(req.body);
    res.send("you hit the route")
})

module.exports = router;
