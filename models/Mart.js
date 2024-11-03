const mongoose = require("mongoose");

const MartSchema = new mongoose.Schema({
    thumbnail1: { type: String, required: true },
    thumbnail2: { type: String, required: true },
    thumbnail3: { type: String, required: true },
    // 추가 썸네일 필드
    additional_thumbnail1: { type: String },
    additional_thumbnail2: { type: String },
    additional_thumbnail3: { type: String },
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
    // 추가 스크립트 필드
    additional_script1: { type: String },
    additional_script2: { type: String },
    additional_script3: { type: String },
    // 상세 페이지 필드
    detailed_page: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mart", MartSchema);