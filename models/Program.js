const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
    _id: {  // _id 필드를 명시적으로 정의
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    script: {
        type: String,
        required: true
    },
    template: {
        type: String,
        required: true,
        default: 'combination'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// pre save 미들웨어 추가
ProgramSchema.pre('save', async function(next) {
    if (this.isNew) {  // 새로운 문서인 경우에만
        // 가장 마지막 문서 찾기
        const lastDoc = await this.constructor.findOne(
            { _id: /^program/ },  // program으로 시작하는 id 찾기
            {},
            { sort: { '_id': -1 } }  // 역순으로 정렬
        );
        
        let sequence = '001';
        if (lastDoc) {
            // 마지막 문서의 ID에서 숫자 부분만 추출해서 1 증가
            const lastSequence = parseInt(lastDoc._id.replace('program', ''));
            sequence = String(lastSequence + 1).padStart(3, '0');
        }
        
        this._id = `program${sequence}`; // program001, program002, ...
    }
    next();
});

module.exports = mongoose.model("Program", ProgramSchema);