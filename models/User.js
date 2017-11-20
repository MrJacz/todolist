const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        default: randomString()
    },
    admin: {
        type: Boolean,
        defaut: false
    }
});

function randomString() {
    const rand = (Math.random() * 100).toString(36).substr(1).replace(/./, "").replace(/,/, "");
    return `ToDoListApi${rand}${Math.floor(Math.sqrt(129112189091890) * Math.random() + 1000 * 2)}${rand}`; //eslint-disable-line
}

mongoose.model("users", UserSchema);
