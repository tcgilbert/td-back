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
    const {
        id,
        name,
        nameShow,
        location,
        locationShow,
        work,
        workShow,
    } = req.body;

    try {
        const requestedAbout = await db.about.findOne({ where: { id: id } });
        requestedAbout.name = name;
        requestedAbout.nameShow = nameShow;
        requestedAbout.location = location;
        requestedAbout.locationShow = locationShow;
        requestedAbout.work = work;
        requestedAbout.workShow = workShow;
        await requestedAbout.save();
        res.status(200).json({ updatedAbout: requestedAbout });
    } catch (error) {
        res.status(400).json({ msg: "Couldn't update about", error: error })
    }
});

module.exports = router;
