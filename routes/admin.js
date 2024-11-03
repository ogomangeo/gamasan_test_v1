const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin_nologout";
const adminLayout3 = "../views/layouts/admin_edit";
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Notice = require("../models/Notice");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Program = require("../models/Program");
const Blog = require("../models/Blog");
const Archive = require("../models/Archive");
const Event = require("../models/Event");
const About = require("../models/About");
const Mart = require("../models/Mart");
const jwtSecret = process.env.JWT_SECRET;

//
//Admin Page
//GET /admin
router.get("/admin", (req, res) => {
  const locals = {
    title: "Admin Page",
  };
  res.render("admin/index", { locals, layout: adminLayout2 });
});

//
//Check Login
//POST admin
router.post(
  "/admin",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "일치하는 사용자가 없습니다." });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/allArchive");
  })
);

// Check Login
//res.redirect(""/admin"")을 호출한 뒤, 또 다른 응답을 시도할 수 있는 부분이 존재"
const checkLogin = (req, res, next) => {
  const token = req.cookies.token; // 토큰 유무 확인하기
  if (!token) {
    return res.redirect("/admin"); // 응답 후 함수 종료
  }
  try {
    const decoded = jwt.verify(token, jwtSecret); //토큰 해석하기
    req.userId = decoded.id; //토큰의 사용자 ID를 요청에 추가하기
    next();
  } catch (error) {
    return res.redirect("/admin"); // 응답 후 함수 종료
  }
};

//Admin Logout
// GET /logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

//Get all Posts
//Get /allPosts
router.get(
  "/allNotices",
  checkLogin,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    const totalItems = await Notice.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const data = await Notice.find()
      .sort({ updatedAt: "desc", createdAt: "desc" })
      .skip(skip)
      .limit(limit);

    const locals = { title: "공지사항" };
    res.render("admin/allNotices", {
      locals,
      data,
      layout: adminLayout3,
      currentPage: page,
      totalPages,
    });
  })
);

//Get all Posts
//Get /allPosts
router.get(
  "/allPrograms",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = {
      title: "쓸만한 프로그램",
    };
    // 교재 내림차순
    const data = await Program.find().sort({
      updatedAt: "desc",
      createdAt: "desc",
    });
    res.render("admin/allPrograms", { locals, data, layout: adminLayout3 });
  })
);

//Get all Posts
//Get /allPosts
router.get(
  "/allBlogs",
  checkLogin,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    const totalItems = await Blog.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const data = await Blog.find()
      .sort({ updatedAt: "desc", createdAt: "desc" })
      .skip(skip)
      .limit(limit);

    const locals = { title: "블로깅" };
    res.render("admin/allBlogs", {
      locals,
      data,
      layout: adminLayout3,
      currentPage: page,
      totalPages,
    });
  })
);

//Get all Posts
//Get /allPosts
router.get(
  "/allArchive",
  checkLogin,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    const totalItems = await Archive.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const data = await Archive.find()
      .sort({ updatedAt: "desc", createdAt: "desc" })
      .skip(skip)
      .limit(limit);

    const locals = { title: "아카이빙" };
    res.render("admin/allArchive", {
      locals,
      data,
      layout: adminLayout3,
      currentPage: page,
      totalPages,
    });
  })
);

//Admin - Add Post
//GET /add
router.get(
  "/add_notice",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = {
      title: "Notice 작성",
    };
    res.render("admin/add_notice", { locals, layout: adminLayout3 });
  })
);

//Admin - Add Post
//GET /add
router.get(
  "/add_program",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = {
      title: "program 작성",
    };
    res.render("admin/add_program", { locals, layout: adminLayout3 });
  })
);

//Admin - Add Post
//GET /add
router.get(
  "/add_blog",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = {
      title: "blog 작성",
    };
    res.render("admin/add_blog", { locals, layout: adminLayout3 });
  })
);

//Admin - Add Post
//GET /add
router.get(
  "/add_archive",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = {
      title: "Archive 작성",
    };
    res.render("admin/add_archive", { locals, layout: adminLayout3 });
  })
);

//Admin - Add Post
//Post /add
router.post(
  "/add_notice",
  checkLogin,
  asyncHandler(async (req, res) => {
    const { thumbnail, title, script } = req.body;
    const newNotice = new Notice({
      thumbnail: thumbnail,
      title: title,
      script: script,
    });
    await Notice.create(newNotice);
    res.redirect("/allNotices");
  })
);

//Admin - Add Post
//Post /add
router.post(
  "/add_program",
  checkLogin,
  asyncHandler(async (req, res) => {
    const { thumbnail, title, script } = req.body;
    const newProgram = new Program({
      thumbnail: thumbnail,
      title: title,
      script: script,
    });
    await Program.create(newProgram);
    res.redirect("/allPrograms");
  })
);

//Admin - Add Post
//Post /add
router.post(
  "/add_blog",
  checkLogin,
  asyncHandler(async (req, res) => {
    const { thumbnail, title, script } = req.body;
    const newBlog = new Blog({
      thumbnail: thumbnail,
      title: title,
      script: script,
    });
    await Blog.create(newBlog);
    res.redirect("/allBlogs");
  })
);

//Admin - Add Post
//Post /add
router.post(
  "/add_archive",
  checkLogin,
  asyncHandler(async (req, res) => {
    const { thumbnail, title, script } = req.body;
    const newArchive = new Archive({
      thumbnail: thumbnail,
      title: title,
      script: script,
    });
    await Archive.create(newArchive);
    res.redirect("/allArchive");
  })
);

//Admin - edit post
//GET /edit/:id
router.get(
  "/edit_notice/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = { title: "게시물 편집" };
    const notice = await Notice.findOne({ _id: req.params.id });
    res.render("admin/edit_notice", { locals, notice, layout: adminLayout3 });
  })
);

//Admin - edit post
//GET /edit/:id
router.get(
  "/edit_program/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = { title: "게시물 편집" };
    const program = await Program.findOne({ _id: req.params.id });
    res.render("admin/edit_program", { locals, program, layout: adminLayout3 });
  })
);

//Admin - edit post
//GET /edit/:id
router.get(
  "/edit_blog/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = { title: "게시물 편집" };
    const blog = await Blog.findOne({ _id: req.params.id });
    res.render("admin/edit_blog", { locals, blog, layout: adminLayout3 });
  })
);

//Admin - edit post
//GET /edit/:id
router.get(
  "/edit_archive/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = { title: "게시물 편집" };
    const archive = await Archive.findOne({ _id: req.params.id });
    res.render("admin/edit_archive", { locals, archive, layout: adminLayout3 });
  })
);

//Admin - edit post
//PUT /edit/:id
router.put(
  "/edit_notice/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await Notice.findByIdAndUpdate(req.params.id, {
      thumbnail: req.body.thumbnail,
      title: req.body.title,
      script: req.body.script,
      createdAt: Date.now(),
    });
    res.redirect("/allNotices");
  })
);

//Admin - edit post
//PUT /edit/:id
router.put(
  "/edit_program/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await Program.findByIdAndUpdate(req.params.id, {
      thumbnail: req.body.thumbnail,
      title: req.body.title,
      script: req.body.script,
      createdAt: Date.now(),
    });
    res.redirect("/allPrograms");
  })
);

//Admin - edit post
//PUT /edit/:id
router.put(
  "/edit_blog/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await Blog.findByIdAndUpdate(req.params.id, {
      thumbnail: req.body.thumbnail,
      title: req.body.title,
      script: req.body.script,
      createdAt: Date.now(),
    });
    res.redirect("/allBlogs");
  })
);

//Admin - edit post
//PUT /edit/:id
router.put(
  "/edit_archive/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await Archive.findByIdAndUpdate(req.params.id, {
      thumbnail: req.body.thumbnail,
      title: req.body.title,
      script: req.body.script,
      createdAt: Date.now(),
    });
    res.redirect("/allArchive");
  })
);

//admin delete Post
//delete /delete/:id
router.delete(
  "/delete_notice/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await Notice.deleteOne({ _id: req.params.id });
    res.redirect("/allNotices");
  })
);

//admin delete Post
//delete /delete/:id
router.delete(
  "/delete_program/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await Program.deleteOne({ _id: req.params.id });
    res.redirect("/allPrograms");
  })
);

//admin delete Post
//delete /delete/:id
router.delete(
  "/delete_blog/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await Blog.deleteOne({ _id: req.params.id });
    res.redirect("/allBlogs");
  })
);

//admin delete Post
//delete /delete/:id
router.delete(
  "/delete_archive/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await Archive.deleteOne({ _id: req.params.id });
    res.redirect("/allArchive");
  })
);

//이벤트이벤트이벤트이벤트이벤트이벤트이벤트이벤트이벤트이벤트이벤트이벤트이벤트이벤트이벤트이벤트이벤트
// 이벤트 목록 조회
router.get(
  "/allEvent",
  checkLogin,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    const totalItems = await Event.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const data = await Event.find()
      .sort({ updatedAt: "desc", createdAt: "desc" })
      .skip(skip)
      .limit(limit);

    const locals = { title: "이벤트" };
    res.render("admin/allEvent", {
      locals,
      data,
      layout: adminLayout3,
      currentPage: page,
      totalPages,
    });
  })
);
// 이벤트 작성 페이지
router.get(
  "/add_event",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = {
      title: "이벤트 작성",
    };
    res.render("admin/add_event", { locals, layout: adminLayout3 });
  })
);
// 이벤트 등록
router.post(
  "/add_event",
  checkLogin,
  asyncHandler(async (req, res) => {
    const { thumbnail, title, script } = req.body;
    const newEvent = new Event({
      thumbnail: thumbnail,
      title: title,
      script: script,
    });
    await Event.create(newEvent);
    res.redirect("/allEvent");
  })
);
// 이벤트 수정 페이지
router.get(
  "/edit_event/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = { title: "이벤트 편집" };
    const event = await Event.findOne({ _id: req.params.id });
    res.render("admin/edit_event", { locals, event, layout: adminLayout3 });
  })
);
// 이벤트 수정 처리
router.put(
  "/edit_event/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await Event.findByIdAndUpdate(req.params.id, {
      thumbnail: req.body.thumbnail,
      title: req.body.title,
      script: req.body.script,
      createdAt: Date.now(),
    });
    res.redirect("/allEvent");
  })
);
// 이벤트 삭제
router.delete(
  "/delete_event/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await Event.deleteOne({ _id: req.params.id });
    res.redirect("/allEvent");
  })
);

//AboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAboutAbout
// POST: 문의 접수 처리
router.post(
  "/about/submit",
  asyncHandler(async (req, res) => {
    try {
      const { email, title, content } = req.body;

      const newAbout = new About({
        email,
        title,
        content,
      });

      await newAbout.save();

      res.send(`
          <script>
              alert('접수되었습니다\\n빠르게 확인 후 답변드리겠습니다.\\n문의주셔서 감사합니다.');
              window.location.href = '/about';
          </script>
      `);
    } catch (error) {
      console.error("Error:", error);
      res.send(`
          <script>
              alert('문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
              window.location.href = '/about';
          </script>
      `);
    }
  })
);

// GET: 모든 문의 내역 조회 (관리자용)
router.get(
  "/allAbout",
  checkLogin,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    const totalItems = await About.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const abouts = await About.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const locals = {
      title: "문의내역",
    };

    res.render("admin/allAbout", {
      locals,
      abouts,
      layout: adminLayout3,
      currentPage: page,
      totalPages,
    });
  })
);

// 읽음 상태 토글 라우트 (PUT에서 POST로 변경)
router.post(
  "/toggle-about-read/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    try {
      console.log("Toggle request received for ID:", req.params.id);

      const about = await About.findById(req.params.id);
      if (!about) {
        console.log("About not found for ID:", req.params.id);
        return res.status(404).json({ message: "문의를 찾을 수 없습니다." });
      }

      about.isRead = !about.isRead;
      await about.save();

      console.log("Toggle successful. New status:", about.isRead);
      res.status(200).json({ message: "상태가 변경되었습니다." });
    } catch (error) {
      console.error("Error in toggle route:", error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
  })
);

router.get(
  "/edit_about/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = { title: "문의사항 편집" };
    const about = await About.findOne({ _id: req.params.id });
    res.render("admin/edit_about", { locals, about, layout: adminLayout3 });
  })
);

// 문의사항 삭제
router.delete(
  "/delete_about/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await About.deleteOne({ _id: req.params.id });
    res.redirect("/allAbout");
  })
);

//martmartmartmartmartmartmartmartmartmartmartmartmartmartmartmartmartmartmartmartmartmartmartmartmartmartmart
router.get(
  "/allMart",
  checkLogin,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 15; // 페이지당 항목 수
    const skip = (page - 1) * limit;

    const totalItems = await Mart.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const locals = {
      title: "상품 관리",
    };
    try {
      const marts = await Mart.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.render("admin/allMart", {
        locals,
        marts,
        layout: adminLayout3,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("서버 오류 발생");
    }
  })
);

// Mart 삭제
router.delete(
  "/allMart/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    try {
      await Mart.findByIdAndDelete(req.params.id);
      res.redirect("/allMart");
    } catch (error) {
      console.error(error);
      res.status(500).send("삭제 중 오류 발생");
    }
  })
);

//Admin - Add mart page
router.get(
  "/add_mart",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = {
      title: "상품 등록",
    };
    res.render("admin/add_mart", { locals, layout: adminLayout3 });
  })
);

//Admin - Add mart process
router.post(
  "/add_mart",
  checkLogin,
  asyncHandler(async (req, res) => {
    const {
      thumbnail1,
      thumbnail2,
      thumbnail3,
      additional_thumbnail1,
      additional_thumbnail2,
      additional_thumbnail3,
      category1,
      category2,
      title,
      brand,
      delivery,
      script,
      additional_script1,
      additional_script2,
      additional_script3,
      detailed_page,
      options,
    } = req.body;

    const newMart = new Mart({
      thumbnail1,
      thumbnail2,
      thumbnail3,
      additional_thumbnail1,
      additional_thumbnail2,
      additional_thumbnail3,
      category1,
      category2,
      title,
      brand,
      delivery,
      script,
      additional_script1,
      additional_script2,
      additional_script3,
      detailed_page,
      options: JSON.parse(options), // options는 배열이므로 JSON 파싱 필요
    });

    await Mart.create(newMart);
    res.redirect("/allMart");
  })
);

//Admin - edit mart page
router.get(
  "/edit_mart/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    try {
      const locals = { title: "상품 편집" };
      const mart = await Mart.findOne({ _id: req.params.id });
      // mart를 locals 객체에 포함시키기
      locals.mart = mart;
      // 또는 별도의 변수로 전달
      res.render("admin/edit_mart", {
        locals,
        mart, // 이 부분이 중요합니다
        layout: adminLayout3,
      });
    } catch (error) {
      console.error("Error in edit_mart route:", error);
      res.status(500).send("Error loading mart data");
    }
  })
);

//Admin - edit mart process
router.put(
  "/edit_mart/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    const {
      thumbnail1,
      thumbnail2,
      thumbnail3,
      additional_thumbnail1,
      additional_thumbnail2,
      additional_thumbnail3,
      category1,
      category2,
      title,
      brand,
      delivery,
      script,
      additional_script1,
      additional_script2,
      additional_script3,
      detailed_page,
      options,
    } = req.body;

    await Mart.findByIdAndUpdate(req.params.id, {
      thumbnail1,
      thumbnail2,
      thumbnail3,
      additional_thumbnail1,
      additional_thumbnail2,
      additional_thumbnail3,
      category1,
      category2,
      title,
      brand,
      delivery,
      script,
      additional_script1,
      additional_script2,
      additional_script3,
      detailed_page,
      options: JSON.parse(options),
      createdAt: Date.now(),
    });

    res.redirect("/allMart");
  })
);

//Admin - delete mart
router.delete(
  "/delete_mart/:id",
  checkLogin,
  asyncHandler(async (req, res) => {
    await Mart.deleteOne({ _id: req.params.id });
    res.redirect("/allMart");
  })
);
module.exports = router;
