require("dotenv").config();
const setContentOrder = require("../utils/setContentOrder")
const express = require("express");
const router = express.Router();
const db = require("../models");

// Blurb create POST
router.post('/create', async (req, res) => {
    const { userId, heading, content } = req.body
    try {        
        const blurb = await db.blurb.create({ 
            userId: userId,
            heading: heading,
            content: content
        })
        await setContentOrder(blurb, userId, "blurb")
        res.status(201).json({ blurb })
    } catch (error) {
        res.status(500).json({ msg: "Couldn't create blurb", error: error })
    }
})



module.exports = router;