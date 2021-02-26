require("dotenv").config();
const setContentOrder = require("../utils/setContentOrder")
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer")
const fs = require("fs")

const db = require("../models");

const transporter = nodemailer.createTransport({
    service: "SendPulse",
    auth: {
        user: 'tcgilbert94@gmail.com',
        pass: "2ERpm8WPqe"
    } 
})


router.post('/verify', async (req, res) => {

    const verifyEmail = await transporter.sendMail({
        from: '"thesedays.io" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
    



    res.send("you made it!")
})



module.exports = router;