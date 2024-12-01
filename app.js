require("dotenv").config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const martRouter = require("./routes/mart-product-image");
const Notice = require("./models/Notice");  // Notice 모델 import 추가

const app = express();
const port = process.env.PORT || 3000;

connectDb();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));

// 최신 공지사항을 가져오는 미들웨어 (다른 미들웨어보다 앞에 위치)
app.use(async (req, res, next) => {
  try {
    const latestNotice = await Notice.findOne()
      .sort({ createdAt: -1 })
      .select('_id title');
    app.locals.latestNotice = latestNotice;
    res.locals.latestNotice = latestNotice;  // 둘 다 설정
    next();
  } catch (err) {
    console.error('Error fetching latest notice:', err);
    res.locals.latestNotice = null;
    next();
  }
});

// member 상태를 설정하는 미들웨어
app.use((req, res, next) => {
  res.locals.path = req.path;
  const pathSegments = req.path.split('/');
  res.locals.title = pathSegments[1] ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1) : 'Home';
  
  app.locals.member = res.locals.member;
  app.locals.isAuthenticated = !!res.locals.member;
  
  next();
});

// admin 라우터 먼저 설정
app.use("/", require("./routes/admin"));

// 라우트 설정
app.use("/", require("./routes/main"));
app.use("/", require("./routes/detail"));
app.use("/", require("./routes/main2"));
app.use("/mart", martRouter);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});