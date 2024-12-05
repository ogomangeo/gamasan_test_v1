// models/Member.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const memberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "이메일은 필수 항목입니다"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "비밀번호는 필수 항목입니다"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "활동명은 필수 항목입니다"],
    unique: true,
    trim: true,
  },
  birthdate: Date,
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  name: String,
  phone: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  agreements: {
    privacyPolicy: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
    _id: false
}
});

// 비밀번호 저장 전 해싱
memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// 비밀번호 검증 메서드
memberSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
