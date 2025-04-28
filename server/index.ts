import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();

// 保存ディレクトリを絶対パスで指定
const uploadDir = path.join("/app", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // オリジナルファイル名をそのまま使う
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  console.log(req.file);
  res.send("Upload successful!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
