require("dotenv").config();
const setContentOrder = require("../utils/setContentOrder")
const express = require("express");
const router = express.Router();

const db = require("../models");

// Create link POST
router.post("/create", async (req, res) => {
    const { url, title, comment, userId } = req.body
    try {        
        const link = await db.link.create({ 
            userId: userId,
            url: url,
            title: title,
        })
        await setContentOrder(link, userId, "link")
        res.status(201).json({ link })
    } catch (error) {
        res.status(500).json({ msg: "Couldn't create link", error: error })
    }
})



module.exports = router