const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { isAdmin } = require("../helpers/auth");

require("../models/User");
const User = mongoose.model("users");


// Index Route
router.get("/", isAdmin, async (req, res) => {
    const users = await User.find({});
    res.render("admin/home", { users: users });
});


module.exports = router;
