// save-climate-game.js
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE_URL = '/';
const DOWNLOAD_DIR = path.join(__dirname, 'climate-game');

(async () => {
  // پوشه ذخیره‌سازی ایجاد شود
  if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // شنود همه درخواست‌ها
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const request = response.request();
      const resourceType = request.resourceType();

      // فقط فایل‌های HTML, JS, CSS و XHR/Fetch
      if (['document', 'script', 'stylesheet', 'xhr', 'fetch'].includes(resourceType)) {
        const fileName = url.split('/').pop().split('?')[0] || 'index.html';
        const filePath = path.join(DOWNLOAD_DIR, fileName);

        let buffer;
        if (resourceType === 'xhr' || resourceType === 'fetch') {
          // پاسخ JSON یا متنی
          buffer = Buffer.from(await response.text());
        } else {
          buffer = await response.body();
        }

        fs.writeFile(filePath, buffer, (err) => {
          if (err) console.error('Error saving', filePath, err);
          else console.log('Saved', filePath);
        });
      }
    } catch (e) {
      console.error(e);
    }
  });

  // صفحه بازی را باز کن
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  // صبر کن تا کاربر یا اسکریپت دیتا کامل بارگذاری کنه
  await page.waitForTimeout(10000); // ۱۰ ثانیه

  await browser.close();
})();
