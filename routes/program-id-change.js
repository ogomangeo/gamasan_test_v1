const mongoose = require('mongoose');
const Program = require('../models/Program');  // './models/Program'에서 '../models/Program'으로 수정

async function migrateIds() {
    try {
        // 기존 문서들을 생성일자 순으로 가져오기
        const programs = await Program.find({
            _id: { $type: "objectId" }  // ObjectId 타입인 문서만 선택
        }).sort({ createdAt: 1 });

        // 각 문서의 ID를 새 형식으로 변경
        for (let i = 0; i < programs.length; i++) {
            const program = programs[i];
            const newId = `program${String(i + 1).padStart(3, '0')}`;
            
            // 새로운 ID로 문서 복사 생성
            const newProgram = new Program({
                _id: newId,
                thumbnail: program.thumbnail,
                title: program.title,
                script: program.script,
                template: program.template,
                createdAt: program.createdAt
            });

            // 새 문서 저장 및 이전 문서 삭제
            await newProgram.save();
            await Program.deleteOne({ _id: program._id });
            
            console.log(`Migrated: ${program._id} -> ${newId}`);
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        mongoose.disconnect();
    }
}

// MongoDB 연결 및 마이그레이션 실행
mongoose.connect('mongodb+srv://88parkcm:12345@cluster0.g2yt2.mongodb.net/MakeNotice')
    .then(() => {
        console.log('Connected to MongoDB');
        return migrateIds();
    })
    .catch(err => console.error('Connection error:', err));