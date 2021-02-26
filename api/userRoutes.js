require("dotenv").config();
const { cloudinary } = require("../config/cloudinary");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const JWT_SECRET = process.env.JWT_SECRET;

const db = require("../models");

// Get user id from username
router.get("/unique/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const user = await db.user.findOne({ where: { username: username } });
        res.status(200).json({ userId: user.id, maintenance: user.maintenance });
    } catch (error) {
        res.status(404).json({
            msg: "Could not find page with that username",
        });
    }
});

// Update Maintenance prop
router.put("/update/maintenance", async (req, res) => {
    const { userId, maintenance } = req.body
    try {
        const reqUser = await db.user.findOne({ where: { id: userId }})
        reqUser.maintenance = maintenance
        await reqUser.save()
        res.status(200).json({ msg: "Property updated"})
    } catch (error) {
        res.status(500).json({ msg: "failed to update property"})
    }
})

// Validate username
router.get("/validate/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const user = await db.user.findOne({ where: { username: username } });
        if (user) {
            res.status(200).json({ usernameTaken: true });
        } else {
            res.status(200).json({ usernameTaken: false });
        }
    } catch (error) {
        res.status(404).json({ usernameTaken: false });
    }
});

// Sign-Up route POST
router.post("/signup", async (req, res) => {
    const { email, username, password } = req.body;
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
                maintenance: false
            });
            bcrypt.genSalt(10, (error, salt) => {
                if (error) throw Error;
                bcrypt.hash(newUser.password, salt, async (error, hash) => {
                    try {
                        if (error) throw Error;
                        // else hash password
                        newUser.password = hash;
                        const createdUser = await newUser.save();
                        if (createdUser) {
                            await db.about.create({
                                name: "",
                                nameShow: false,
                                location: "",
                                locationShow: false,
                                work: "",
                                workShow: false,
                                pictureId: null,
                                userId: createdUser.id,
                                fileName: "default",
                            });
                        }
                        res.status(201).json(createdUser);
                    } catch (err) {
                        res.status(500).json({
                            msg: "Hashing error",
                            error: err,
                        });
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
                    { expiresIn: "2h" },
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

// Token checkpoint route POST
router.post("/check-token", async (req, res) => {
    const { token } = req.body;
    const payload = jwt_decode(token);
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            res.status(401).json({ userFound: false });
        } else {
            try {
                const requestedUser = await db.user.findOne({
                    where: { username: payload.username },
                });
                if (requestedUser) {
                    res.status(200).json({ userFound: true });
                }
            } catch (error) {
                res.status(401).json({ userFound: false });
            }
        }
    })
   
});

// Delete user
router.delete("/delete/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const userContent = await db.content.findAll({
            where: { userId: userId },
        });
        if (userContent.length > 0) {
            await Promise.all(
                userContent.forEach(async (ele) => {
                    if (ele.type === "blurb") {
                        let blurb = await db.blurb.findOne({
                            where: { id: ele.contentId },
                        });
                        await blurb.destroy();
                    }
                    if (ele.type === "soundtrack") {
                        let soundtrack = await db.soundtrack.findOne({
                            where: { id: ele.contentId },
                        });
                        await soundtrack.destroy();
                    }
                    if (ele.type === "link") {
                        let link = await db.link.findOne({
                            where: { id: ele.contentId },
                        });
                        await link.destroy();
                    }
                    if (ele.type === "book") {
                        let book = await db.book.findOne({
                            where: { id: ele.contentId },
                        });
                        await book.destroy();
                    }
                    if (ele.type === "comment") {
                        let comment = await db.comment.findOne({
                            where: { id: ele.contentId },
                        });
                        await comment.destroy();
                    }
                    let content = await db.content.findOne({
                        where: { id: ele.id },
                    });
                    await content.destroy();
                })
            );
        }
        const about = await db.about.findOne({ where: { userId: userId }})
        console.log(about.pictureId);
        if (about.pictureId) await cloudinary.uploader.destroy(about.pictureId);
        await about.destroy()
        const user = await db.user.findOne({ where: { id: userId }})
        await user.destroy()
        res.status(200).json({ msg: "User successfully deleted" });
    } catch (error) {
        res.status(500).json({ msg: "Failed to delete user", error: error });
    }
});

module.exports = router;
