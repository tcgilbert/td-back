require("dotenv").config();
const setContentOrder = require("../utils/setContentOrder");
const express = require("express");
const router = express.Router();
const db = require("../models");

// Blurb create POST
router.post("/create", async (req, res) => {
    const { userId, heading, content } = req.body;
    try {
        const blurb = await db.blurb.create({
            userId: userId,
            heading: heading,
            content: content,
        });
        const newContent = await setContentOrder(blurb, userId, "blurb");
        let reformatted = {
            userId: newContent.userId,
            id: newContent.id,
            index: newContent.index,
            type: newContent.type,
            show: newContent.show,
            content: blurb
        };
        res.status(201).json({ reformatted });
    } catch (error) {
        res.status(500).json({ msg: "Couldn't create blurb", error: error });
    }
});

// Blurb update PUT
router.put("/update", async (req, res) => {
    const { id, newContent, newHeading } = req.body;
    try {
        const blurb = await db.blurb.findOne({ where: { id: id } });
        blurb.content = newContent;
        blurb.heading = newHeading;
        await blurb.save();
        res.status(200).json({ blurb });
    } catch (error) {
        res.status(500).json({ msg: "Couldn't update blurb", error: error });
    }
});

module.exports = router;
