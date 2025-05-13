import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const uploadDir = path.join('/app', 'uploads');
const soccerDir = path.join('/app', 'soccer');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(soccerDir)) {
	fs.mkdirSync(soccerDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => cb(null, Date.now() + '.' + file.originalname.split('.')[1])
});

const soccerStorage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, soccerDir),
	filename: (req, file, cb) => {
		cb(null, req.body.id + '.' + file.originalname.split('.')[1]);
	}
});

const fieldSize = 25 * 1024 * 1024; // 25MB
const upload = multer({ storage, fieldSize });
const soccerUpload = multer({ storage: soccerStorage, fieldSize });

app.use('/images', express.static(uploadDir));
app.use('/images/soccer', express.static(soccerDir));

app.post('/upload', upload.single('file'), (req, res) => {
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

app.post('/soccer/upload', soccerUpload.single('file'), (req, res) => {
	res.send('Upload successful!');
});

const CONFS = {
	'select-conf': 'select-conf.txt',
	'soccer/conf': 'soccer-conf.txt',
	'soccer/ranking-conf': 'soccer-ranking-conf.txt',
	'band/conf': 'band-conf.txt'
};

Object.entries(CONFS).forEach(([route, fileName]) => {
	app.get(`/${route}`, (req, res) => {
		const filePath = path.join('/app', fileName);
		if (fs.existsSync(filePath)) {
			const data = fs.readFileSync(filePath, 'utf8');
			res.json({ text: data });
		} else {
			res.status(404).send('File not found');
		}
	});

	app.post(`/${route}`, (req, res) => {
		const filePath = path.join('/app', fileName);
		fs.writeFile(filePath, req.body.text, 'utf8', (err) => {
			if (err) {
				console.error(err);
				return res.status(500).send('Failed to save file');
			}
			res.status(200).send('File saved successfully!');
		});
	});
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
