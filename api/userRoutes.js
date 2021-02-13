const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const db = require("../models");

router.get('/', (req, res) => {
    res.send("hit the users endpoint")
})

// Sign-Up route POST
router.post("/signup", async (req, res) => {
    const { email, name, username, password } = req.body;
    console.log(req.body);
    try {
        const emailInUse = await db.User.findOne({ where: { email: email } });
        const usernameInUse = await db.User.findOne({
            where: { username: username },
        });
        if (emailInUse) {
            return res.status(400).json({ msg: "Email already in use" });
        } else if (usernameInUse) {
            return res.status(400).json({ msg: "Username already in use" });
        } else {
            const newUser = await db.User.create({
                name: name,
                username: username,
                email: email,
                password: password,
            });
            bcrypt.genSalt(10, (error, salt) => {
                if (error) throw Error;
                bcrypt.hash(newUser.password, salt, async (error, hash) => {
                    try {
                        if (error) throw Error;
                        // else hash password
                        newUser.password = hash;
                        const createdUser = await newUser.save();
                        res.status(201).json(createdUser);
                    } catch (err) {
                        res.status(500).json({ msg: "Hashing error", error: err });
                    }
                });
            });
        }
    } catch (error) {
        res.status(500).json({ msg: "Signup error", error: error });
    }
});

module.exports = router