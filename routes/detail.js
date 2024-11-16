const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Notice = require("../models/Notice");
const Program = require("../models/Program");
const Blog = require("../models/Blog");
const Archive = require("../models/Archive");
const Mart = require("../models/Mart");
const Event = require("../models/Event");

const homeLayout = "../views/layouts/home.ejs";

// 공지사항 상세 페이지 라우트
router.get(
  "/notice/:id",
  asyncHandler(async (req, res) => {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).render("error", {
        layout: homeLayout,
        message: "공지사항을 찾을 수 없습니다.",
      });
    }

    // 이전 공지사항 찾기
    const previousNotice = await Notice.findOne({
      createdAt: { $lt: notice.createdAt },
    }).sort({ createdAt: -1 });

    // 다음 공지사항 찾기
    const nextNotice = await Notice.findOne({
      createdAt: { $gt: notice.createdAt },
    }).sort({ createdAt: 1 });

    res.render("detail/detail_notice", {
      layout: homeLayout,
      notice,
      previousNotice,
      nextNotice,
    });
  })
);

// 프로그램 상세 페이지 라우트
router.get(
  "/program/:id",
  asyncHandler(async (req, res) => {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).render("error", {
        layout: homeLayout,
        message: "프로그램을 찾을 수 없습니다.",
      });
    }

    // 모든 프로그램 목록 가져오기
    const programs = await Program.find().sort({ createdAt: -1 });

    // 이전/다음 프로그램 찾기
    const previousProgram = await Program.findOne({
      createdAt: { $lt: program.createdAt },
    }).sort({ createdAt: -1 });

    const nextProgram = await Program.findOne({
      createdAt: { $gt: program.createdAt },
    }).sort({ createdAt: 1 });

    res.render("detail/detail_program", {
      layout: homeLayout,
      program,
      currentProgram: program,
      programs,
      previousProgram,
      nextProgram,
    });
  })
);

// 블로그 상세 페이지 라우트
router.get(
  "/blog/:id",
  asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).render("error", {
        layout: homeLayout,
        message: "블로그 글을 찾을 수 없습니다.",
      });
    }

    // 이전 블로그 글 찾기
    const previousBlog = await Blog.findOne({
      createdAt: { $lt: blog.createdAt },
    }).sort({ createdAt: -1 });

    // 다음 블로그 글 찾기
    const nextBlog = await Blog.findOne({
      createdAt: { $gt: blog.createdAt },
    }).sort({ createdAt: 1 });

    res.render("detail/detail_blog", {
      layout: homeLayout,
      blog,
      previousBlog,
      nextBlog,
    });
  })
);

// 아카이빙 상세 페이지 라우트
router.get(
  "/archive/:id",
  asyncHandler(async (req, res) => {
    const archive = await Archive.findById(req.params.id);
    if (!archive) {
      return res.status(404).render("error", {
        layout: homeLayout,
        message: "아카이빙 항목을 찾을 수 없습니다.",
      });
    }

    // 이전 아카이브 찾기
    const previousArchive = await Archive.findOne({
      createdAt: { $lt: archive.createdAt },
    }).sort({ createdAt: -1 });

    // 다음 아카이브 찾기
    const nextArchive = await Archive.findOne({
      createdAt: { $gt: archive.createdAt },
    }).sort({ createdAt: 1 });

    res.render("detail/detail_archive", {
      layout: homeLayout,
      archive,
      previousArchive,
      nextArchive,
    });
  })
);

// Mart 상세 페이지 라우트
// Mart 상세 페이지 라우트
router.get(
  "/mart/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    let mart;

    // URL인 경우 market_url로 검색
    if (id.startsWith("http") || id.startsWith("www")) {
      mart = await Mart.findOne({
        "market_link.market_url": id,
      });
    } else {
      // ObjectId로 검색
      try {
        mart = await Mart.findById(id);
      } catch (error) {
        // ObjectId가 아닌 경우 market_url로 한번 더 시도
        mart = await Mart.findOne({
          "market_link.market_url": id,
        });
      }
    }

    if (!mart) {
      return res.status(404).render("error", {
        layout: homeLayout,
        message: "마트 상품을 찾을 수 없습니다.",
      });
    }

    // 이전 마트 상품 찾기
    const previousMart = await Mart.findOne({
      createdAt: { $lt: mart.createdAt },
    }).sort({ createdAt: -1 });

    // 다음 마트 상품 찾기
    const nextMart = await Mart.findOne({
      createdAt: { $gt: mart.createdAt },
    }).sort({ createdAt: 1 });

    res.render("detail/detail_mart", {
      layout: homeLayout,
      mart,
      previousMart,
      nextMart,
    });
  })
);

// 공지사항 상세 페이지 라우트
router.get(
  "/event/:id",
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).render("error", {
        layout: homeLayout,
        message: "공지사항을 찾을 수 없습니다.",
      });
    }

    // 이전 공지사항 찾기
    const previousEvent = await Event.findOne({
      createdAt: { $lt: event.createdAt },
    }).sort({ createdAt: -1 });

    // 다음 공지사항 찾기
    const nextEvent = await Event.findOne({
      createdAt: { $gt: event.createdAt },
    }).sort({ createdAt: 1 });

    res.render("detail/detail_event", {
      layout: homeLayout,
      event,
      previousEvent,
      nextEvent,
    });
  })
);
module.exports = router;
