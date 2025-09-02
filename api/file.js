import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { file } = req.query;

  const filePath = path.join(process.cwd(), 'climate-game', file);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Not found');
  }
}
