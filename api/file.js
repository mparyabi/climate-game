import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { file } = req.query;
  const filePath = path.join(process.cwd(), 'climate-game', file);

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);

    // تعیین Content-Type بر اساس پسوند فایل (مثال برای چند نوع معمولی)
    const ext = path.extname(file).toLowerCase();
    let contentType = 'application/octet-stream';

    if (ext === '.json') contentType = 'application/json';
    else if (ext === '.html') contentType = 'text/html';
    else if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

    res.setHeader('Content-Type', contentType);
    res.status(200).send(fileBuffer);
  } else {
    res.status(404).send('Not found');
  }
}
