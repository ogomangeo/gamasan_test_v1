//Mart 스키마 모델 항목 업데이트 코드

const mongoose = require("mongoose");
const Mart = require("../models/Mart"); // Mart 모델 경로

// MongoDB 연결
mongoose.connect("mongodb+srv://88parkcm:12345@cluster0.g2yt2.mongodb.net/MakeNotice")  // 여기에 실제 DB URL 입력
    .then(() => console.log("DB 연결 성공"))
    .catch((err) => console.log("DB 연결 실패:", err));

async function updateExistingDocuments() {
    try {
        await Mart.updateMany({}, {
            $set: {
                additional_thumbnail1: "",
                additional_thumbnail2: "",
                additional_thumbnail3: "",
                additional_script1: "",
                additional_script2: "",
                additional_script3: "",
                detailed_page: ""
            }
        });
        console.log("기존 문서 업데이트 완료");
        process.exit(0); // 성공적으로 완료되면 프로세스 종료
    } catch (error) {
        console.error("마이그레이션 에러:", error);
        process.exit(1); // 에러 발생 시 프로세스 종료
    }
}

// 마이그레이션 실행
updateExistingDocuments();