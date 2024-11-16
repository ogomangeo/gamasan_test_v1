const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: function() {
            return 'program' + new Date().getTime(); // 임시 ID 생성
        }
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
        default: Date.now
    },
    youtube_url: {
        type: String,
        required: true
    },
});

// pre save 미들웨어 수정
ProgramSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const lastDoc = await this.constructor.findOne(
                { _id: /^program\d{3}$/ },  // program + 3자리 숫자 형식만 검색
                {},
                { sort: { '_id': -1 } }
            );
            
            if (lastDoc) {
                const lastNum = parseInt(lastDoc._id.replace('program', ''));
                this._id = `program${String(lastNum + 1).padStart(3, '0')}`;
            } else {
                this._id = 'program001';  // 첫 번째 문서
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});

module.exports = mongoose.model("Program", ProgramSchema);