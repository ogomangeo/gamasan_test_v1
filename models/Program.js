const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
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
    template: {
        type: String,
        required: true,
        default: 'combination'  // 여기에 default 설정
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Program", ProgramSchema);
