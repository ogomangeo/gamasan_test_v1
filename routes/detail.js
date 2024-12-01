const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Notice = require("../models/Notice");
const Program = require("../models/Program");
const Archive = require("../models/Archive");
const Mart = require("../models/Mart");

const homeLayout = "../views/layouts/home.ejs";
const mainLayout = "../views/layouts/main.ejs";

// 공지사항 상세 페이지 라우트
router.get(
  "/notice/:id",
  asyncHandler(async (req, res) => {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).render("error", {
        layout: mainLayout,
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
      layout: mainLayout,
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
        layout: mainLayout,
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
      layout: mainLayout,
      program,
      currentProgram: program,
      programs,
      previousProgram,
      nextProgram,
    });
  })
);



// 아카이빙 상세 페이지 라우트
router.get(
  "/archive/:id",
  asyncHandler(async (req, res) => {
    try {
      const archive = await Archive.findById(req.params.id);
      
      if (!archive) {
        return res.status(404).render("page/error", {
          layout: mainLayout,
          message: "아카이빙 항목을 찾을 수 없습니다.",
          error: {
            status: 404,
            stack: process.env.NODE_ENV === 'development' ? '404 Not Found' : ''
          }
        });
      }

      // 이전 아카이브 찾기 (에러 처리 추가)
      let previousArchive = null;
      try {
        previousArchive = await Archive.findOne({
          createdAt: { $lt: archive.createdAt }
        }).sort({ createdAt: -1 });
      } catch (err) {
        console.error('이전 아카이브 조회 실패:', err);
      }

      // 다음 아카이브 찾기 (에러 처리 추가)
      let nextArchive = null;
      try {
        nextArchive = await Archive.findOne({
          createdAt: { $gt: archive.createdAt }
        }).sort({ createdAt: 1 });
      } catch (err) {
        console.error('다음 아카이브 조회 실패:', err);
      }

      res.render("detail/detail_archive", {
        layout: mainLayout,
        archive,
        previousArchive,
        nextArchive,
      });
      
    } catch (error) {
      console.error('아카이브 조회 중 에러 발생:', error);
      res.status(500).render("page/error", {
        layout: mainLayout,
        message: "서버 오류가 발생했습니다.",
        error: {
          status: 500,
          stack: process.env.NODE_ENV === 'development' ? error.stack : ''
        }
      });
    }
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
        layout: mainLayout,
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
      layout: mainLayout,
      mart,
      previousMart,
      nextMart,
    });
  })
);

module.exports = router;
