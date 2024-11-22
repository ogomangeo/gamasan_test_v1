require('dotenv').config();
const mongoose = require("mongoose");
const Fortune = require("./models/Fortune");  // 경로 수정

const fortunes = [
  {
    type: "特大吉 (특대길)",
    description: "오늘은 최고의 날입니다. 중요한 결정이나 프로젝트를 시작하기에 이상적이며...",
    advice: "회의나 발표가 있다면 자신감 있게 나서세요. 계약, 면접, 또는 금전적 투자를 추진하기에 매우 유리합니다...",
    level: 1 // 최고 레벨
  },
  {
    type: "大吉 (대길)",
    description: "매우 좋은 운세로, 대부분의 일이 원활하게 흘러갑니다...",
    advice: "중요한 업무를 마무리하거나 사람들과의 협업을 강화해 보세요...",
    level: 2
  },
  {
    type: "中吉 (중길)",
    description: "꽤 좋은 날입니다. 특별히 큰 성과는 아니더라도 꾸준한 노력이 보상받는 하루가 될 것입니다...",
    advice: "평소 미뤄왔던 일들을 차근차근 해결해 보세요...",
    level: 3
  },
  {
    type: "小吉 (소길)",
    description: "운이 나쁘지 않은 날입니다. 사소한 기쁨과 만족이 따릅니다...",
    advice: "작은 성과에도 감사하며 하루를 보내세요...",
    level: 4
  },
  {
    type: "平 (평)",
    description: "특별한 운이 작용하지 않는 평범한 날입니다...",
    advice: "루틴을 유지하며 일상에 충실하세요. 무리하지 말고 휴식을 취하기에 적합한 하루입니다...",
    level: 5
  },
  {
    type: "小凶 (소흉)",
    description: "약간 나쁜 운세입니다. 사소한 실수나 장애물이 생길 수 있으니...",
    advice: "신중히 일정을 검토하고, 중요한 일은 다음 날로 미루는 것이 좋습니다...",
    level: 6
  },
  {
    type: "中凶 (중흉)",
    description: "오늘은 어려움이 있을 가능성이 높습니다...",
    advice: "계약이나 중요한 결정을 미루고, 조용히 하루를 보내세요...",
    level: 7
  },
  {
    type: "大凶 (대흉)",
    description: "매우 나쁜 운세로, 계획이 틀어질 가능성이 큽니다...",
    advice: "중요한 약속이나 발표는 가능한 한 연기하세요...",
    level: 8
  },
  {
    type: "特大凶 (특대흉)",
    description: "모든 면에서 큰 주의가 필요한 날입니다...",
    advice: "가능하면 하루 일정을 최소화하고, 조용히 혼자 시간을 보내세요...",
    level: 9 // 최악 레벨
  }
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB 연결 성공!");

    // 기존 데이터 삭제
    await Fortune.deleteMany({});
    console.log("기존 데이터 삭제 완료!");

    // 새 데이터 삽입
    await Fortune.insertMany(fortunes);
    console.log("운세 데이터 삽입 완료!");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("MongoDB 연결 실패:", err);
  });