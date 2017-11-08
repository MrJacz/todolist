const express = require("express");
const mongoose = require("mongoose");
// Express router
const router = express.Router();
// Mongoose Models
require("../models/Api");
require("../models/Idea");
const User = mongoose.model("users");
const Idea = mongoose.model("ideas");
// Handy Function 
const { ensureAuthenticated } = require("../helpers/auth");

router.get("/", ensureAuthenticated, (req, res) => {
    res.render("api/home", { key: req.user.token });
});

router.get("/items", (req, res) => {
    const auth = req.get("Key");
    if (!auth) return res.status(401).json({ authorization: "Please provide vaild Api Key" });
    User.findOne({ token: auth })
        .then(user => {
            console.log("user", user);
            if (!user) return res.status(401).json({ authorization: "Please provide vaild Api Key" });
            Idea.find({ user: user._id })
                .sort({ date: "desc" })
                .then(ideas => res.status(200).json({ items: ideas })).catch();
        }).catch(console.log);
});

router.post("/add", (req, res) => {
    const auth = req.get("Key");
    if (!auth) return res.status(401).json({ authorization: "Please provide vaild Api Key" });
    const errors = [];
    if (!req.body.title) errors.push({ text: "Please add a title" });
    if (!req.body.details) errors.push({ text: "Please add some details" });
    if (errors.length > 0) {
        res.status(404).json({ errors });
    } else {
        User.findOne({ token: auth })
            .then(user => {
                if (!user) return res.status(401).json({ authorization: "Please provide vaild Api Key" });
                console.log(user);
                const newIdea = {
                    title: req.body.title,
                    details: req.body.details,
                    user: user._id
                };
                new Idea(newIdea)
                    .save()
                    .then(() => {
                        res.status(200).json({ success: "Todolist Item added" });
                    });
            }).catch(console.log);
    }
});

module.exports = router;
