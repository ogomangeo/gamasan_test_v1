const mongoose = require("mongoose");

const ArchiveSchema = new mongoose.Schema({
    thumbnails: [{
        type: String,
        required: true
    }],
    title: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    script: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Archive", ArchiveSchema);