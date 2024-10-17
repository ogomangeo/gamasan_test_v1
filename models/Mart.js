const mongoose = require("mongoose");

const MartSchema = new mongoose.Schema({
    thumbnail1: { type: String, required: true },
    thumbnail2: { type: String, required: true },
    thumbnail3: { type: String, required: true },
    category1: { type: String, required: true },
    category2: { type: String, required: true },
    title: { type: String, required: true },
    brand: { type: String, required: true },
    options: [{
        name: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    delivery: { type: String, required: true },
    script: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mart", MartSchema);
