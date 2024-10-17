const mongoose = require("mongoose");

const ArchiveSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    script: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Archive", ArchiveSchema);

