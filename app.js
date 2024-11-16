require("dotenv").config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const martRouter = require("./routes/mart-product-image");

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

// member 상태를 설정하는 미들웨어
app.use((req, res, next) => {
  // 기존 설정 유지
  res.locals.path = req.path;
  const pathSegments = req.path.split('/');
  res.locals.title = pathSegments[1] ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1) : 'Home';
  
  // member 정보를 app.locals에 설정 (전역적으로 사용 가능)
  app.locals.member = res.locals.member;
  
  // 템플릿에서 member 체크를 쉽게 하기 위한 헬퍼 함수
  app.locals.isAuthenticated = !!res.locals.member;
  
  next();
});

// 라우트 설정
app.use("/", require("./routes/main"));
app.use("/", require("./routes/admin"));
app.use("/", require("./routes/detail"));
app.use("/", require("./routes/main2"));
app.use("/mart", martRouter);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});