const mongoose = require("mongoose");

const fortuneSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "特大吉 (특대길)",
      "大吉 (대길)",
      "中吉 (중길)",
      "小吉 (소길)",
      "平 (평)",
      "小凶 (소흉)",
      "中凶 (중흉)",
      "大凶 (대흉)",
      "特大凶 (특대흉)",
    ],
  },
  description: { type: String, required: true },
  advice: { type: String, required: true },
  level: { type: Number, min: 1, max: 9, required: true },
  date: { type: Date, default: Date.now },
  username: { type: String } // 사용자별 운세를 저장하기 위한 필드
});

// username과 date로 복합 인덱스 생성 (하루에 한 번만 운세 받기 위함)
fortuneSchema.index({ username: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Fortune", fortuneSchema);