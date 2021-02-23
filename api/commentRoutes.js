require("dotenv").config();
const setContentOrder = require("../utils/setContentOrder")
const express = require("express");
const router = express.Router();

const db = require("../models");


// Create comment POST
router.post("/create", async (req, res) => {
    const { comment, userId } = req.body
    try {        
        const commentCreated = await db.comment.create({ 
            userId: userId,
            comment: comment,
        })
        const newContent = await setContentOrder(commentCreated, userId, "comment")
        let reformatted = {
            userId: newContent.userId,
            id: newContent.id,
            index: newContent.index,
            type: newContent.type,
            show: newContent.show,
            content: commentCreated
        };
        res.status(201).json({ reformatted })
    } catch (error) {
        res.status(500).json({ msg: "Couldn't create comment", error: error })
    }
})

// Comment update PUT
router.put('/update', async (req, res) => {
    const { id, newComment } = req.body
    try {
        const comment = await db.comment.findOne({ where: { id: id }})
        comment.comment = newComment
        await comment.save()
        res.status(200).json({ comment })
    } catch (error) {
        res.status(500).json({ msg: "Couldn't update comment", error: error })
    }
})

module.exports = router