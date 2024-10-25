// updateDB.js 파일 내용 수정
const mongoose = require('mongoose');
const Program = require('../models/Program');  // 상대 경로 수정 (상위 폴더의 models로 접근)

// MongoDB 연결
mongoose.connect('mongodb+srv://88parkcm:12345@cluster0.g2yt2.mongodb.net/MakeNotice', {
  useNewUrlParser: true,
    useUnifiedTopology: true
});

async function updatePrograms() {
    try {
        // template 필드가 없는 모든 문서 업데이트
        const result = await Program.updateMany(
            { template: { $exists: false } },
            { $set: { template: 'combination' } }
        );

        console.log(`Updated ${result.modifiedCount} documents`);
    } catch (error) {
        console.error('Error updating documents:', error);
    } finally {
        mongoose.disconnect();
    }
}

updatePrograms();