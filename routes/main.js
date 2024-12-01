const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');

const mainLayout = "../views/layouts/main.ejs";
const Notice = require("../models/Notice");
const Program = require("../models/Program");
const Archive = require("../models/Archive");
const Mart = require("../models/Mart");
const asyncHandler = require("express-async-handler");
const Member = require("../models/Member");
const Fortune = require("../models/Fortune");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const memberJwtSecret = process.env.MEMBER_JWT_SECRET;

// main.js 최상단의 미들웨어
router.use(async (req, res, next) => {
  try {
    const token = req.cookies.memberToken;
    // console.log('Token:', token);
    
    if (token) {
      const decoded = jwt.verify(token, memberJwtSecret);
      // console.log('Decoded token:', decoded);
      
      const member = await Member.findById(decoded.id).select('-password');
      // console.log('Found member:', member);
      
      // res.locals에 할당
      res.locals.member = member;
      // app.locals에도 할당
      req.app.locals.member = member;
    } else {
      res.locals.member = null;
      req.app.locals.member = null;
    }
  } catch (error) {
    // console.error('Auth middleware error:', error);
    res.locals.member = null;
    req.app.locals.member = null;
  }
  next();
});

router.get(
  ["/", "/home"],
  asyncHandler(async (req, res) => {
    const locals = {
      title: "Home",
      member: res.locals.member
    };

    const notices = await Notice.find({}).sort({ createdAt: -1 }).limit(8);
    const programs = await Program.find({}).sort({ createdAt: -1 }).limit(15);
    const archives = await Archive.find({}).sort({ createdAt: -1 }).limit(8);
    const marts = await Mart.find({}).sort({ createdAt: -1 }).limit(8);

    res.render("page/index", {
      locals,
      notices,
      programs,
      archives,
      marts,
      member: res.locals.member,
      layout: mainLayout
    });
  })
);
router.get("/program", asyncHandler(async (req, res) => {
  const locals = {
    title: "Program",
  };

  // 페이지 번호 및 페이지 당 항목 수 설정
  const page = parseInt(req.query.page) || 1;
  const limit = 16;
  const skip = (page - 1) * limit;

  // 전체 프로그램 포스트 수 가져오기
  const totalPosts = await Program.countDocuments();

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalPosts / limit);

  // 현재 페이지에 해당하는 프로그램 데이터 가져오기
  const data = await Program.find({})
    .sort({ createdAt: -1 })  // 최신 순으로 정렬
    .skip(skip)
    .limit(limit);

  // 클라이언트에 렌더링
  res.render("page/program", { 
    locals, 
    data, 
    layout: mainLayout,
    currentPage: page,
    totalPages: totalPages,
    member: res.locals.member
  });
}));

// main.js의 프로그램 상세 라우트 부분을 수정
router.get("/program/:id", asyncHandler(async (req, res) => {
  try {
      const program = await Program.findById(req.params.id);
      if (!program) {
          return res.redirect('/program');
      }

      // script 필드를 select에 추가
      const programs = await Program.find({})
          .sort({ createdAt: -1 })
          .select('_id title script thumbnail createdAt'); // script 추가

      // 이전글, 다음글 찾기
      const [previousProgram, nextProgram] = await Promise.all([
          Program.findOne({
              createdAt: { $lt: program.createdAt }
          }).sort({ createdAt: -1 }),
          Program.findOne({
              createdAt: { $gt: program.createdAt }
          }).sort({ createdAt: 1 })
      ]);

      const templateName = program.template;
      const templatePath = path.join(__dirname, `../views/program-template/${templateName}.html`);
      
      try {
          const templateContent = fs.readFileSync(templatePath, 'utf-8');
          res.render("detail/detail_program", {
              program,
              programs,
              templateContent,
              previousProgram,
              nextProgram,
              layout: mainLayout,
              member: res.locals.member
          });
      } catch (fsError) {
          console.error('Error reading template file:', fsError);
          console.log('Current directory:', __dirname);
          res.redirect('/program');
      }

  } catch (error) {
      console.error('Error finding program:', error);
      res.redirect('/program');
  }
}));


router.get("/about", (req, res) => {
  const locals = {
    title: "About",
  };
  res.render("page/about", { locals, layout: mainLayout, member: res.locals.member, });
});

router.get("/notice", asyncHandler(async (req, res) => {
  const locals = {
    title: "Notice",
  };

  // Set page number and items per page
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  // Get total number of notice posts
  const totalPosts = await Notice.countDocuments();

  // Calculate total number of pages
  const totalPages = Math.ceil(totalPosts / limit);

  // Fetch notice data for the current page
  const data = await Notice.find({})
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limit);

  res.render("page/notice", { 
    locals, 
    data, 
    layout: mainLayout,
    currentPage: page,
    totalPages: totalPages,
    member: res.locals.member
  });
}));


router.get("/archive", asyncHandler(async (req, res) => {
  const locals = {
    title: "Archive",
  };

  // 페이지 번호와 한 페이지당 표시할 아이템 수 설정
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  // 전체 아카이빙 수 조회
  const totalArchives = await Archive.countDocuments();

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalArchives / limit);

  // 현재 페이지에 해당하는 아카이빙 데이터 조회
  const data = await Archive.find({})
    .sort({ createdAt: -1 }) // 최신 순으로 정렬
    .skip(skip)
    .limit(limit);

  res.render("page/archive", { 
    locals, 
    data, 
    layout: mainLayout,
    currentPage: page,
    totalPages: totalPages,
    member: res.locals.member
  });
}));

router.get("/mart", asyncHandler(async (req, res) => {
  const locals = {
    title: "Mart",
  };

  // 페이지 번호와 한 페이지당 표시할 아이템 수 설정
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  // 전체 상품 수 조회
  const totalMarts = await Mart.countDocuments();

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalMarts / limit);

  // 현재 페이지에 해당하는 상품 데이터 조회
  const data = await Mart.find({})
    .sort({ createdAt: -1 }) // 최신 순으로 정렬
    .skip(skip)
    .limit(limit);

  res.render("page/mart", { 
    locals, 
    data, 
    layout: mainLayout,
    currentPage: page,
    totalPages: totalPages,
    totalMarts: totalMarts,
    member: res.locals.member
  });
}));

router.get("/join", asyncHandler(async (req, res) => {
  res.render("page/join", {
    title: "Join",
    layout: mainLayout,
    member: res.locals.member
  });
}));

router.get("/login", asyncHandler(async (req, res) => {
  res.render("page/member_login", {
    title: "Login",
    layout: mainLayout,
    member: res.locals.member
  });
}));

const checkMemberLogin = (req, res, next) => {
  const token = req.cookies.memberToken;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, memberJwtSecret);
    req.memberId = decoded.id;
    next();
  } catch (error) {
    return res.redirect('/login');
  }
};

// 로그인 POST 라우트
router.post("/login", asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const member = await Member.findOne({ email });

    if (!member) {
      return res.status(401).json({
        status: 'fail',
        message: '이메일 또는 비밀번호가 일치하지 않습니다.'
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, member.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'fail',
        message: '이메일 또는 비밀번호가 일치하지 않습니다.'
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign({ id: member._id }, memberJwtSecret);
    
    // 쿠키에 토큰 저장
    res.cookie('memberToken', token, { httpOnly: true });
    
    // 로그인 성공 시 홈페이지로 리다이렉트
    res.redirect('/');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}));

// 로그아웃 라우트 추가
router.get('/logout', (req, res) => {
  res.clearCookie('memberToken');
  res.redirect('/');
});

router.post("/join", asyncHandler(async (req, res) => {
  try {
    const newMember = await Member.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      birthdate: req.body.birthdate,
      gender: req.body.gender,
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address
    });

    newMember.password = undefined;

    res.status(201).json({
      status: 'success',
      data: newMember
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        status: 'fail',
        message: '이미 등록된 이메일입니다.'
      });
    } else {
      res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }
}));

// 회원 마이페이지 라우트
//★ ★ 항상 마지막에 위치시킬것~~
// /:username 라우트 수정
router.get('/member/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const currentUser = res.locals.member;

    // 로그인 체크
    if (!currentUser) {
      return res.redirect('/login');
    }

    // 요청된 프로필 사용자 조회
    const profileUser = await Member.findOne({ username: username });
    
    if (!profileUser) {
      return res.render("page/error", { 
        locals: {
          title: "Error",
          description: "사용자를 찾을 수 없습니다."
        },
        layout: mainLayout,
        member: currentUser
      });
    }

    // 자신의 프로필이 아닌 경우 접근 차단
    if (currentUser.username !== username) {
      return res.render("page/error", {
        locals: {
          title: "Error",
          description: "접근 권한이 없습니다."
        },
        layout: mainLayout,
        member: currentUser
      });
    }

    // 운세 정보 조회 (자신의 프로필인 경우에만)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fortune = await Fortune.findOne({
      username: username,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    res.render("detail/detail_profile", {
      title: `${username}의 프로필`,
      member: currentUser,
      profileUser: profileUser,
      fortune: fortune,
      layout: mainLayout
    });

  } catch (error) {
    console.error('프로필 조회 에러:', error);
    res.render("page/error", {
      locals: {
        title: "Error",
        description: "서버 오류가 발생했습니다."
      },
      layout: mainLayout,
      member: currentUser
    });
  }
});

// 운세 API 라우트 수정
router.get('/api/fortune', async (req, res) => {
  try {
    if (!res.locals.member) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
 
    const username = res.locals.member.username;
    
    // 오늘 날짜 범위 설정
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 이미 오늘의 운세가 있는지 확인
    let todayFortune = await Fortune.findOne({
      username: username,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
 
    // 오늘의 운세가 없는 경우에만 새로 생성
    if (!todayFortune) {
      // 정규분포에 따른 레벨 결정
      const levels = [
        { level: 1, prob: 2.1 },  // 特大吉
        { level: 2, prob: 6.8 },  // 大吉
        { level: 3, prob: 16.1 }, // 中吉
        { level: 4, prob: 23.9 }, // 小吉
        { level: 5, prob: 27.0 }, // 平
        { level: 6, prob: 13.6 }, // 小凶
        { level: 7, prob: 6.8 },  // 中凶
        { level: 8, prob: 2.1 },  // 大凶
        { level: 9, prob: 1.6 }   // 特大凶
      ];
 
      // 랜덤 값 생성 (0-100)
      const rand = Math.random() * 100;
      let cumulative = 0;
      let selectedLevel = 5; // 기본값
 
      // 누적 확률로 레벨 선택
      for (const { level, prob } of levels) {
        cumulative += prob;
        if (rand <= cumulative) {
          selectedLevel = level;
          break;
        }
      }
 
      // 선택된 레벨에 해당하는 운세 가져오기
      const fortunePool = await Fortune.find({ level: selectedLevel });
      if (fortunePool.length > 0) {
        const randomIndex = Math.floor(Math.random() * fortunePool.length);
        const fortuneData = fortunePool[randomIndex];
        
        // 새로운 운세 객체 생성
        todayFortune = new Fortune({
          type: fortuneData.type,
          description: fortuneData.description,
          advice: fortuneData.advice,
          level: fortuneData.level,
          username: username,
          date: new Date()
        });
 
        await todayFortune.save();
      }
    }
 
    res.json(todayFortune);
  } catch (error) {
    console.error('운세 생성 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
 });

module.exports = router;