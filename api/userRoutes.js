require("dotenv").config()
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const JWT_SECRET = process.env.JWT_SECRET

const db = require("../models");

router.get('/', (req, res) => {
    res.send("hit the users endpoint")
})

// Sign-Up route POST
router.post("/signup", async (req, res) => {
    const { email, username, password } = req.body;
    console.log(req.body);
    console.log(email);
    console.log(username);
    console.log(password);
    try {
        const emailInUse = await db.user.findOne({ where: { email: email } });
        const usernameInUse = await db.user.findOne({
            where: { username: username },
        });
        if (emailInUse) {
            return res.status(400).json({ msg: "Email already in use" });
        } else if (usernameInUse) {
            return res.status(400).json({ msg: "Username already in use" });
        } else {
            const newUser = await db.user.create({
                username: username,
                email: email,
                password: password,
            });
            console.log("made it this far");
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

// Login route POST
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        // check for user with that email
        let requestedUser = await db.user.findOne({
            where: {
                username: username,
            },
        });

        if (!requestedUser) {
            res.status(400).json({ msg: "User not found" });
        } else {
            // login user
            const isMatch = await bcrypt.compare(
                password,
                requestedUser.password
            );
            if (isMatch) {
                // token payload
                const payload = {
                    id: requestedUser.id,
                    username: requestedUser.username,
                };
                // token signature
                jwt.sign(
                    payload,
                    JWT_SECRET,
                    { expiresIn: "1h" },
                    (error, token) => {
                        if (error) {
                            console.log("error creating token");
                        }
                        res.json({
                            success: true,
                            token: token,
                        });
                    }
                );
            } else {
                return res.status(400).json({ msg: "Password is incorrect" });
            }
        }
    } catch (error) {
        return res.status(400).json({ msg: "Email or password incorrect" });
    }
});

module.exports = router