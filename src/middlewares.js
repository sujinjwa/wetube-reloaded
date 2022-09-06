import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  // console.log(res.locals);
  // console.log(req.session.user);
  next();
};

export const protectorMiddleware = (req, res, next) => {
  // 로그인 돼있지 않은 유저는 로그인 페이지로 리디렉션
  if (req.session.loggedIn) {
    next(); // 유저가 로그인된 경우 next() 함수 호출
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next(); // loggedIn 돼있지 않다면, next() 함수 호출
  } else {
    return res.redirect("/"); // 로그인된 유저라면 home 화면으로 리디렉션
  }
};

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerUploader = multerS3({
  s3: s3,
  bucket: "wetube-sujin", // AWS bucket 이름 넣기
  acl: "public-read",
});

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000, // 단위: bytes // 0여섯개
  },
  storage: multerUploader,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 10000, // 0 일곱개
  },
  storage: multerUploader,
});
