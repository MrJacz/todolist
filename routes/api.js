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
            if (!user) return res.status(401).json({ authorization: "Please provide vaild Api Key" });
            Idea.find({ user: user._id })
                .sort({ date: "desc" })
                .then(ideas => res.status(200).json({ items: ideas })).catch(console.log);
        }).catch(console.log);
});

module.exports = router;
