import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const uploadDir = path.join('/app', 'uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => cb(null, Date.now() + '.' + file.originalname.split('.')[1])
});

const upload = multer({ storage });

app.use('/images', express.static(uploadDir));
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

app.get('/select-conf', (req, res) => {
	const filePath = '/app/select-conf.txt';
	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, 'utf8');
		res.json({ text: data });
	} else {
		res.status(404).send('File not found');
	}
});
app.post('/select-conf', (req, res) => {
	fs.writeFileSync('/app/select-conf.txt', req.body.text, 'utf8');
	res.status(200).send('File saved successfully!');
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
