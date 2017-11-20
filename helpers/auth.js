module.exports = {
    ensureAuthenticated: ensureAuth,
    isAdmin: checkAdmin
};

const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
};

const checkAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.email === "admin@jaczaus.me") {
        console.log(`Admin bypassing to admin panel from ${req.ip}`);
        return next();
    }
    req.flash("error_msg", "Not Authorized");
    req.session.backURL = req.originalURL;
    return res.redirect("/");
};

