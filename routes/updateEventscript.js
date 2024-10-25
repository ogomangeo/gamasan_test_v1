const mongoose = require('mongoose');
const Event = require('./path/to/Event'); // Event 모델 임포트

// MongoDB 연결 (실제 URL로 교체해야 합니다)
mongoose.connect('mongodb://localhost/your_database', { useNewUrlParser: true, useUnifiedTopology: true });

async function updateScriptFields() {
  try {
    // 업데이트할 데이터 준비
    const updates = [
      { _id: 'document1_id', newScript: '새로운 스크립트 1' },
      { _id: 'document2_id', newScript: '새로운 스크립트 2' },
      { _id: 'document3_id', newScript: '새로운 스크립트 3' },
      // 필요한 만큼 추가
    ];

    // 각 문서 개별적으로 업데이트
    for (const update of updates) {
      const result = await Event.findByIdAndUpdate(
        update._id,
        { $set: { script: update.newScript } },
        { new: true }
      );
      console.log(`문서 ${update._id} 업데이트 완료:`, result.script);
    }

    console.log('모든 업데이트가 완료되었습니다.');
  } catch (error) {
    console.error('업데이트 중 오류 발생:', error);
  } finally {
    mongoose.disconnect(); // 데이터베이스 연결 종료
  }
}

updateScriptFields();