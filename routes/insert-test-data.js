// insert-test-data.js
const mongoose = require('mongoose');
const Mart = require('../models/Mart'); // Mart 모델 경로에 맞게 수정해주세요

// MongoDB 연결
mongoose.connect('mongodb+srv://88parkcm:12345@cluster0.g2yt2.mongodb.net/MakeNotice', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const marketTemplates = [
  {
    market_name: "스마트스토어",
    market_url: "https://smartstore.naver.com",
    market_description: "네이버 스마트스토어 구매 혜택"
  },
  {
    market_name: "쿠팡",
    market_url: "https://coupang.com",
    market_description: "쿠팡 구매 혜택"
  },
  {
    market_name: "다음쇼핑",
    market_url: "https://shopping.daum.com",
    market_description: "다음 쇼핑 구매 혜택"
  },
  {
    market_name: "네이트쇼핑",
    market_url: "https://shopping.nate.com",
    market_description: "네이트 쇼핑 구매 혜택"
  },
  {
    market_name: "G마켓",
    market_url: "https://gmarket.com",
    market_description: "G마켓 구매 혜택"
  }
];

// 2~5개의 랜덤한 마켓을 선택하는 함수
function getRandomMarkets() {
  const count = Math.floor(Math.random() * 4) + 2; // 2~5 사이의 랜덤 숫자
  const shuffled = [...marketTemplates].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(market => ({
    market_name: market.market_name,
    market_url: market.market_url,
    market_options: [
      {
        name: "기본 옵션",
        price: 89000
      },
      {
        name: "프리미엄 옵션",
        price: 129000
      }
    ],
    market_description: market.market_description
  }));
}

// 기존 데이터 업데이트
async function updateTestData() {
  try {
    // 모든 문서를 찾아서 업데이트
    const documents = await Mart.find({});
    
    for (const doc of documents) {
      doc.market_link = getRandomMarkets();
      await doc.save();
      console.log(`Updated document ID: ${doc._id}`);
    }

    console.log('All documents updated successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating documents:', error);
    mongoose.connection.close();
  }
}

// 실행
updateTestData();