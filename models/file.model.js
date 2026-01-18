const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    originalName: String,
    storedName: String,
    mimeType: String,
    size: Number,
    path: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("file", fileSchema);
