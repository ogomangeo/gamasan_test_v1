const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const connectDb = asyncHandler(async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,  // MongoDB Atlas는 기본적으로 SSL을 사용
            // sslCA: 'path_to_certificate.pem', // 인증서가 필요한 경우 경로 추가
        });
        console.log(`DB Connected: ${connect.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // 연결 실패 시 프로세스를 종료
    }
});

module.exports = connectDb;
