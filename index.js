const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const multer = require('multer');
const path = require('path');

const PORT = process.env.PORT || 3000;

const users = {
  "Aare": "200",
  "Raen": "Lauraudaronkasutu",
  "Kova": "Kanameboss3000"
};

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.redirect(`/chat.html?user=${encodeURIComponent(username)}`);
  } else {
    res.send('Invalid login. <a href="/">Try again</a>');
  }
});

app.post('/upload', upload.single('image'), (req, res) => {
  io.emit('chat message', { user: '📷 Image', text: `/uploads/${req.file.filename}` });
  res.redirect('back');
});

io.on('connection', socket => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
