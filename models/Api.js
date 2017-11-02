const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ApiSchema = new Schema({
    apiKey: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model("api", ApiSchema);
