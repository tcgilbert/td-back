require("dotenv").config();
const express = require("express");
const router = express.Router();

const db = require("../models");

const deleteByType = async (type, id) => {
    if (type === "blurb") {
        const toDelete = await db.blurb.findOne({ where: { id: id } });
        await toDelete.destroy();
    } else if (type === "link") {
        const toDelete = await db.link.findOne({ where: { id: id } });
        await toDelete.destroy();
    } else if (type === "comment") {
        const toDelete = await db.comment.findOne({ where: { id: id } });
        await toDelete.destroy();
    } else if (type === "book") {
        const toDelete = await db.book.findOne({ where: { id: id } });
        await toDelete.destroy();
    }
    else {
        const toDelete = await db.soundtrack.findOne({ where: { id: id } });
        await toDelete.destroy();
    }
};

const resetIndices = async (array) => {
    for (let i = 0; i < array.length; i++) {
        const content = await db.content.findOne({
            where: { id: array[i].id },
        });
        content.index = i;
        await content.save()
    }
}

// Get users content GET
router.get("/getall/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const content = await db.content.findAll({
            where: { userId: userId },
            order: [["index", "ASC"]],
        });
        let userContent = await Promise.all(
            content.map(async (ele) => {
                let element = {
                    userId: userId,
                    id: ele.id,
                    index: ele.index,
                    type: ele.type,
                    show: ele.show
                };
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
                if (ele.type === "comment") {
                    const comment = await db.comment.findOne({
                        where: { id: ele.contentId },
                    });
                    element.content = comment;
                }
                if (ele.type === "soundtrack") {
                    const soundtrack = await db.soundtrack.findOne({
                        where: { id: ele.contentId },
                    });
                    element.content = soundtrack;
                }
                if (ele.type === "book") {
                    const book = await db.book.findOne({
                        where: { id: ele.contentId },
                    });
                    element.content = book;
                }
                return element;
            })
        );
        res.status(200).json({ userContent, contentRaw: content });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Delete content DELETE
router.delete("/delete", async (req, res) => {
    const { contentId, type, typeId, userId } = req.body;
    try {
        const toDelete = await db.content.findOne({ where: { id: contentId } });
        await toDelete.destroy();
        await deleteByType(type, typeId)
        const content = await db.content.findAll({
            where: { userId: userId },
            order: [["index", "ASC"]],
        });
        await resetIndices(content)
        res.status(200).json({ msg: "Successfully deleted and updated content"})
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
        res.status(200).json({ msg: "Content updated" });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Update show prop PUT
router.put("/update/show", async (req, res) => {
    const { id, show } = req.body;
    try {
        const content = await db.content.findOne( { where: { id: id }})
        content.show = show
        content.save()
        res.status(200).json({ updated: content });
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;
