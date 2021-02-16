require("dotenv").config();
const express = require("express");
const router = express.Router();

const db = require("../models");

// Get users content GET
router.get("/getall/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const content = await db.content.findAll({ where: { userId: userId } });
        let userContent = await Promise.all(
            content.map(async (ele) => {
                let element = { id: ele.id, index: ele.index, type: ele.type };
                if (ele.type === "blurb") {
                    const blurb = await db.blurb.findOne({
                        where: { id: ele.contentId },
                    });
                    element.content = blurb;
                }
                if (ele.type === "link") {
                    const link = await db.link.findOne({
                        where: { id: ele.contentId },
                    });
                    element.content = link;
                }
                return element;
            })
        );
        res.status(200).json({ userContent, contentRaw: content });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Update content PUT
router.put("/update", async (req, res) => {
    const { content, userId } = req.body;
    try {
        let newContent = await Promise.all(
            content.map(async (ele) => {
                const content = await db.content.findOne({
                    where: { id: ele.id },
                });
                content.index = ele.index;
                await content.save();
                return content;
            })
        );
        res.status(200).json({ msg: "Content updated"})
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;
