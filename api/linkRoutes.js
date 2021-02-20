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
        const newContent = await setContentOrder(link, userId, "link")
        let reformatted = {
            userId: newContent.userId,
            id: newContent.id,
            index: newContent.index,
            type: newContent.type,
            show: newContent.show,
            content: link
        };
        res.status(201).json({ reformatted })
    } catch (error) {
        res.status(500).json({ msg: "Couldn't create link", error: error })
    }
})

// Link update PUT
router.put('/update', async (req, res) => {
    const { id, newUrl, newTitle } = req.body
    try {
        const link = await db.link.findOne({ where: { id: id }})
        link.url = newUrl
        link.title = newTitle
        await link.save()
        res.status(200).json({ link })
    } catch (error) {
        res.status(500).json({ msg: "Couldn't update link", error: error })
    }
})



module.exports = router