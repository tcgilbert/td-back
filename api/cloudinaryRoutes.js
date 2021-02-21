require("dotenv").config();
const { cloudinary } = require("../config/cloudinary");
const express = require("express");
const router = express.Router();

const db = require("../models");

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
    console.log(cloudinaryConfig);
    try {
        const uploadedRes = await cloudinary.uploader.upload(image, cloudinaryConfig);
        const about = await db.about.findOne({ where: { userId: userId } });
        about.pictureId = uploadedRes.public_id
        about.fileName = fileName
        about.save()
        res.status(200).json({ about })
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
