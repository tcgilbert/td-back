require("dotenv").config();
const express = require("express");
const router = express.Router();
const fs = require("fs")

const db = require("../models");



router.post('/verify', async (req, res) => {





    res.send("you made it!")
})



module.exports = router;