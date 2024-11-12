const mongoose = require('mongoose');
const Mart = require('../models/Mart');

mongoose.connect('mongodb+srv://88parkcm:12345@cluster0.g2yt2.mongodb.net/MakeNotice');

async function migrateExistingDocuments() {
  try {
    const marts = await Mart.find({});
    console.log(`Found ${marts.length} documents to migrate`);

    for (const mart of marts) {
      // 상세 이미지에 기본 썸네일들 추가
      mart.detailed_images = [
        mart.thumbnail1,
        mart.thumbnail2,
        mart.thumbnail3
      ].filter(img => img && img.trim() !== '');  // 빈 문자열 제거
      
      // 추가 썸네일이 있다면 추가
      [mart.additional_thumbnail1, mart.additional_thumbnail2, mart.additional_thumbnail3]
        .forEach(img => {
          if (img && img.trim() !== '') {
            mart.detailed_images.push(img);
          }
        });

      // market_link가 비어있다면 기본 마켓 정보 추가
      if (!mart.market_link || mart.market_link.length === 0) {
        mart.market_link = [{
          market_name: `${mart.brand} 공식몰`,
          market_url: `https://example.com/${mart._id}`,
          market_options: mart.options.map(opt => ({
            name: opt.name,
            price: opt.price
          })),
          market_description: `${mart.brand} 공식몰 구매 혜택 안내`
        }];
      }

      // 저장
      await mart.save();
      console.log(`Updated document: ${mart._id}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    mongoose.connection.close();
  }
}

// MongoDB 연결이 열리면 마이그레이션 실행
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  migrateExistingDocuments();
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});