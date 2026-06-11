const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const PASSWORD = process.env.ADMIN_PASSWORD;
const SCHEDULE_PATH = path.join(__dirname, '../LPAI/schedule.json');

app.use(express.json());

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/api/schedule', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(SCHEDULE_PATH, 'utf8'));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Cannot read schedule' });
  }
});

app.post('/api/schedule', (req, res) => {
  const { password, ...data } = req.body;
  if (!PASSWORD) return res.status(500).json({ error: 'ADMIN_PASSWORD not set on server' });
  if (password !== PASSWORD) return res.status(401).json({ error: 'Sai mật khẩu' });
  try {
    fs.writeFileSync(SCHEDULE_PATH, JSON.stringify(data, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Cannot write schedule' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Admin server running on port ${PORT}`);
});
