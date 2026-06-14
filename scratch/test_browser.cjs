const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER PAGEERROR] ${err.message}`);
  });

  page.on('requestfailed', request => {
    console.error(`[BROWSER REQFAILED] ${request.url()}: ${request.failure().errorText}`);
  });

  const url = 'http://localhost:5173/#/3d-rogue-action';
  console.log(`Navigating to ${url}...`);
  await page.goto(url);
  await page.waitForTimeout(2000);

  console.log('Clicking "ゲーム開始" button...');
  // ボタンテキストが「ゲーム開始」であるボタンをクリック
  const startButton = page.locator('button:has-text("ゲーム開始")');
  if (await startButton.count() > 0) {
    await startButton.click();
    console.log('Clicked start button. Waiting for Unity to load...');
    await page.waitForTimeout(8000); // Unityのロードと初期化を待つ
  } else {
    console.error('Start button not found!');
  }

  console.log('Closing browser...');
  await browser.close();
})();
