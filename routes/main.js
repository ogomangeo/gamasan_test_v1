const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');

const mainLayout = "../views/layouts/main.ejs";
const homeLayout = "../views/layouts/home.ejs";
const Notice = require("../models/Notice");
const Program = require("../models/Program");
const Blog = require("../models/Blog");
const Archive = require("../models/Archive");
const Mart = require("../models/Mart");
const Event = require("../models/Event");
const asyncHandler = require("express-async-handler");

router.get(
  ["/", "/home"],
  asyncHandler(async (req, res) => {
    const locals = {
      title: "Home",
    };
    const notices = await Notice.find({}).limit(8);  // 최신 3개만 가져옴
    const programs = await Program.find({}).limit(6);  // 최신 9개만 가져옴
    const blogs = await Blog.find({}).limit(8);  // 최신 3개만 가져옴
    const archives = await Archive.find({}).limit(18);  // 최신 3개만 가져옴
    const marts = await Mart.find({}).limit(8);  // 최신 3개만 가져옴

    res.render("page/index", {
      locals,
      notices,
      programs,
      blogs,
      archives,
      marts,
      layout: homeLayout
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
    totalPages: totalPages
  });
}));

router.get("/program/:id", asyncHandler(async (req, res) => {
  try {
      const program = await Program.findById(req.params.id);
      if (!program) {
          return res.redirect('/program');
      }

      // 이전글, 다음글 찾기
      const [previousProgram, nextProgram] = await Promise.all([
          // 현재 글보다 이전에 작성된 글 중 가장 최근 글
          Program.findOne({
              createdAt: { $lt: program.createdAt }
          }).sort({ createdAt: -1 }),
          // 현재 글보다 나중에 작성된 글 중 가장 오래된 글
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
              templateContent,
              previousProgram,  // 이전글 데이터 전달
              nextProgram,      // 다음글 데이터 전달
              layout: mainLayout
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
  res.render("page/about", { locals, layout: homeLayout });
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
    layout: homeLayout,
    currentPage: page,
    totalPages: totalPages
  });
}));


router.get("/blog", asyncHandler(async (req, res) => {
  const locals = {
    title: "Blog",
  };

  // 페이지 번호와 한 페이지당 표시할 아이템 수 설정
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  // 전체 블로그 포스트 수 조회
  const totalPosts = await Blog.countDocuments();

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(totalPosts / limit);

  // 현재 페이지에 해당하는 블로그 데이터 조회
  const data = await Blog.find({})
    .sort({ createdAt: -1 }) // 최신 순으로 정렬
    .skip(skip)
    .limit(limit);

  res.render("page/blog", { 
    locals, 
    data, 
    layout: homeLayout,
    currentPage: page,
    totalPages: totalPages
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
    layout: homeLayout,
    currentPage: page,
    totalPages: totalPages
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
    totalMarts: totalMarts
  });
}));

router.get("/event", asyncHandler(async (req, res) => {
  const locals = {
    title: "Event",
  };

  // 페이지 번호 및 페이지 당 항목 수 설정
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  // 전체 프로그램 포스트 수 가져오기
  const totalPosts = await Event.countDocuments();

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalPosts / limit);

  // 현재 페이지에 해당하는 프로그램 데이터 가져오기
  const data = await Event.find({})
    .sort({ createdAt: -1 })  // 최신 순으로 정렬
    .skip(skip)
    .limit(limit);

  // 클라이언트에 렌더링
  res.render("page/event", { 
    locals, 
    data, 
    layout: mainLayout,
    currentPage: page,
    totalPages: totalPages
  });
}));

module.exports = router;