require("dotenv").config();
const { cloudinary } = require("../config/cloudinary")
const express = require("express");
const router = express.Router();

const db = require("../models");

router.post('/profile-pic', async (req, res) => {
    const image = req.body.base64EncodedImage
    try {
        const uploadedRes = await cloudinary.uploader.upload(image, {
            upload_preset: 'thesedays_ml'
        })
        console.log(uploadedRes);
        res.send('booyahh')
    } catch (error) {
        console.log(error);
    }
})

module.exports = router