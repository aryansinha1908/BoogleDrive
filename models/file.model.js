const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    originalName: String,
    storedName: String,
    mimeType: String,
    size: Number,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    publicUrl: {
        type: String,
        required: true,
    },
    storagePath: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("file", fileSchema);
