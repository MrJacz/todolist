const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

// Load User Model
require("../models/User");
const User = mongoose.model("users");

// User Login Route
router.get("/login", (req, res) => {
    res.render("users/login");
});

// User Register Route
router.get("/register", (req, res) => {
    res.render("users/register");
});

// Login Form POST
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/ideas",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

// Register Form POST
router.post("/register", (req, res) => {
    const errors = [];

    if (req.body.password !== req.body.password2) errors.push({ text: "Passwords do not match" });

    if (req.body.password.length < 8) errors.push({ text: "Password must be at least 8 characters" });

    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash("error_msg", "Email already regsitered");
                    res.redirect("/users/register");
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        token: randomString()
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        bcrypt.hash(newUser.password, salt, (err, hash) => { // eslint-disable-line
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save().then(() => { // eslint-disable-line
                                req.flash("success_msg", "You are now registered and can log in");
                                res.redirect("/users/login");
                            }).catch(err => console.log(err.stack)); // eslint-disable-line
                        });
                    });
                }
            });
    }
});

// Logout User
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
});

module.exports = router;

function randomString() {
    const rand = (Math.random() * 100).toString(36).substr(1).replace(/./, "").replace(/,/, "");
    return `ToDoListApi${rand}${Math.floor(Math.sqrt(129112189091890) * Math.random() + 1000 * 2)}${rand}`; //eslint-disable-line
}