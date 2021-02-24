require("dotenv").config();
const setContentOrder = require("../utils/setContentOrder")
const express = require("express");
const router = express.Router();
const db = require("../models");

// Book create POST
router.post('/create', async (req, res) => {
    const { userId, apiId, title} = req.body
    try {        
        const book = await db.book.create({ 
            userId: userId,
            apiId: apiId,
            title: title
        })
        const newContent = await setContentOrder(book, userId, "book")
        let reformatted = {
            userId: newContent.userId,
            id: newContent.id,
            index: newContent.index,
            type: newContent.type,
            show: newContent.show,
            content: book
        };
        res.status(201).json({ reformatted })
    } catch (error) {
        res.status(500).json({ msg: "Couldn't create book", error: error })
    }
})



module.exports = router;