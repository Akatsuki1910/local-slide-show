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

const upload = multer({ storage });
const soccerUpload = multer({ storage: soccerStorage });

app.use('/images', express.static(uploadDir));
app.use('/images/soccer', express.static(soccerDir));

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

app.post('/soccer/upload', soccerUpload.single('file'), (req, res) => {
	console.log(req.file);
	res.send('Upload successful!');
});
app.get('/soccer/conf', (req, res) => {
	const filePath = '/app/soccer-conf.txt';
	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, 'utf8');
		res.json({ text: data });
	} else {
		res.status(404).send('File not found');
	}
});
app.post('/soccer/conf', (req, res) => {
	fs.writeFileSync('/app/soccer-conf.txt', req.body.text, 'utf8');
	res.status(200).send('File saved successfully!');
});

app.get('/soccer/ranking-conf', (req, res) => {
	const filePath = '/app/soccer-ranking-conf.txt';
	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, 'utf8');
		res.json({ text: data });
	} else {
		res.status(404).send('File not found');
	}
});
app.post('/soccer/ranking-conf', (req, res) => {
	fs.writeFileSync('/app/soccer-ranking-conf.txt', req.body.text, 'utf8');
	res.status(200).send('File saved successfully!');
});

app.get('/band/conf', (req, res) => {
	const filePath = '/app/band-conf.txt';
	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, 'utf8');
		res.json({ text: data });
	} else {
		res.status(404).send('File not found');
	}
});
app.post('/band/conf', (req, res) => {
	fs.writeFileSync('/app/band-conf.txt', req.body.text, 'utf8');
	res.status(200).send('File saved successfully!');
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
