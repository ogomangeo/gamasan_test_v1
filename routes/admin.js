const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin_nologout";
const adminLayout3 = "../views/layouts/admin_edit";
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Notice = require("../models/Notice");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Program = require("../models/Program");
const Blog = require("../models/Blog");
const Archive = require("../models/Archive");
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
    const locals = {
      title: "공지사항",
    };
    // 교재 내림차순
    const data = await Notice.find().sort({
      updatedAt: "desc",
      createdAt: "desc",
    });
    res.render("admin/allNotices", { locals, data, layout: adminLayout3 });
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
    const locals = {
      title: "블로깅",
    };
    // 교재 내림차순
    const data = await Blog.find().sort({
      updatedAt: "desc",
      createdAt: "desc",
    });
    res.render("admin/allBlogs", { locals, data, layout: adminLayout3 });
  })
);

//Get all Posts
//Get /allPosts
router.get(
  "/allArchive",
  checkLogin,
  asyncHandler(async (req, res) => {
    const locals = {
      title: "아카이빙",
    };
    // 교재 내림차순
    const data = await Archive.find().sort({
      updatedAt: "desc",
      createdAt: "desc",
    });
    res.render("admin/allArchive", { locals, data, layout: adminLayout3 });
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

module.exports = router;
