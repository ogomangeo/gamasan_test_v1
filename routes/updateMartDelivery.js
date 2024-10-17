const mongoose = require('mongoose');
const Mart = require('../models/Mart');

// MongoDB 연결
mongoose.connect('mongodb+srv://88parkcm:12345@cluster0.g2yt2.mongodb.net/MakeNotice', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function updateExistingDocuments() {
  try {
    const result = await Mart.updateMany(
      { delivery: { $exists: false } },
      { $set: { delivery: "default delivery value" } }
    );
    console.log(`${result.modifiedCount} documents were updated.`);
  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    mongoose.connection.close();
  }
}

// MongoDB 연결이 열리면 함수 실행
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  updateExistingDocuments();
});

// 연결 에러 처리
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});