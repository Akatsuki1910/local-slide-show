import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();

// 保存ディレクトリを絶対パスで指定
const uploadDir = path.join('/app', 'uploads');
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
	}
});

const upload = multer({ storage });

app.use('/uploads', express.static(uploadDir));
app.post('/upload', upload.single('file'), (req, res) => {
	console.log(req.file);
	res.send('Upload successful!');
});

app.get('/files', (req, res) => {
	fs.readdir(uploadDir, (err, files) => {
		if (err) {
			console.error(err);
			return res.status(500).send('Failed to read uploads folder');
		}
		res.json(files);
	});
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
