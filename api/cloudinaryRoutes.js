require("dotenv").config();
const { cloudinary } = require("../config/cloudinary");
const express = require("express");
const router = express.Router();

const db = require("../models");


router.get("/profile-pic", async (req, res) => {
    const public_id = req.query.public_id
    console.log(public_id);
    try {
        const image = await cloudinary.api.resources_by_ids([public_id])
        console.log(image);
        res.send("oohhhyeyeah")
    } catch (error) {
        console.log(error);
    }
})


router.post("/profile-pic", async (req, res) => {
    const image = req.body.base64EncodedImage;
    const { fileName, userId, publicId } = req.body;
    let cloudinaryConfig;

    if (publicId) {
        cloudinaryConfig = {
            public_id: publicId
        }
    } else {
        cloudinaryConfig = {
            upload_preset: "thesedays_ml"
        } 
    }
    try {
        const uploadedRes = await cloudinary.uploader.upload(image, cloudinaryConfig);
        console.log(uploadedRes);
        const about = await db.about.findOne({ where: { userId: userId } });
        about.pictureId = uploadedRes.public_id
        about.picture = uploadedRes.url
        about.fileName = fileName
        about.save()
        res.status(200).json({ about })
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
