const mongoose = require("mongoose");

const MartSchema = new mongoose.Schema({
    thumbnail1: { type: String, required: true },
    thumbnail2: { type: String, required: true },
    thumbnail3: { type: String, required: true },
    additional_thumbnail1: { type: String },
    additional_thumbnail2: { type: String },
    additional_thumbnail3: { type: String },
    
    market_link: [{
        market_name: { type: String, required: true },     // 마켓 이름 (예: 쿠팡, 11번가 등)
        market_url: { type: String, required: true },      // 기본 링크 URL
        market_options: [{                                 // 해당 마켓의 옵션들
            name: { type: String, required: true },        // 옵션명
            price: { type: Number, required: true }        // 옵션 가격
        }],
        market_description: { type: String }               // 마켓 관련 추가 설명
    }],

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
    additional_script1: { type: String },
    additional_script2: { type: String },
    additional_script3: { type: String },
    
    detailed_images: [{ type: String, required: true }],   // 상세 이미지 URL 배열
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mart", MartSchema);