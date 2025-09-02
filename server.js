// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DATA_DIR = path.join(__dirname, 'climate-game');

app.use(express.static(DATA_DIR));

app.get('/api/:file', (req, res) => {
  const filePath = path.join(DATA_DIR, req.params.file);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
