require("dotenv").config();
const setContentOrder = require("../utils/setContentOrder")
const express = require("express");
const router = express.Router();
const db = require("../models");

// Soundtrack create POST
router.post('/create', async (req, res) => {
    const { userId, spotifyId, comment, type } = req.body
    console.log(req.body);
    try {        
        const soundtrack = await db.soundtrack.create({ 
            userId: userId,
            spotifyId: spotifyId,
            comment: comment,
            type: type
        })
        
        const newContent = await setContentOrder(soundtrack, userId, "soundtrack")
        let reformatted = {
            userId: newContent.userId,
            id: newContent.id,
            index: newContent.index,
            type: newContent.type,
            show: newContent.show,
            content: soundtrack
        };
        res.status(201).json({ reformatted })
    } catch (error) {
        res.status(500).json({ msg: "Couldn't create soundtrack", error: error })
    }
})



module.exports = router;