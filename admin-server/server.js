const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const PASSWORD = process.env.ADMIN_PASSWORD;
const BATCHES_PATH = path.join(__dirname, '../LPAI/batches.json');

app.use(express.json());

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/api/batches', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(BATCHES_PATH, 'utf8'));
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Cannot read batches' });
  }
});

app.post('/api/batches', (req, res) => {
  const { password, batches } = req.body;
  if (!PASSWORD) return res.status(500).json({ error: 'ADMIN_PASSWORD not set' });
  if (password !== PASSWORD) return res.status(401).json({ error: 'Sai mật khẩu' });
  try {
    fs.writeFileSync(BATCHES_PATH, JSON.stringify(batches, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Cannot write batches' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Admin server running on port ${PORT}`);
});
