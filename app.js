const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const app = express();

// Load routes
const main = require("./routes/main");
const admin = require("./routes/admin");
const ideas = require("./routes/ideas");
const users = require("./routes/users");
const api = require("./routes/api");

// Passport Config
require("./config/passport")(passport);
// DB Config
const db = require("./config/database");

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI, { useMongoClient: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Method override middleware
app.use(methodOverride("_method"));

// Express session midleware
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// Use routes
app.use("/", main);
app.use("/admin", admin);
app.use("/ideas", ideas);
app.use("/users", users);
app.use("/api", api);
const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
