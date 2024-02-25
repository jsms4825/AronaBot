const puppeteer = require('puppeteer');
require('dotenv').config();

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const username = process.env.X_ID;
    const pwd = process.env.X_PWD;

    // Login
    await page.goto('https://twitter.com/i/flow/login', { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 1280, height: 800 });

    // input ID
    await page.waitForSelector('[autocomplete="username"]');
    await page.type('input[autocomplete="username"]', username, { delay: 50 });
    await page.evaluate(() => {
        document.querySelectorAll('div[role="button"]')[2].click()
    });

    // input pwd
    await page.waitForSelector('[autocomplete="current-password"]');
    await page.type('input[autocomplete="current-password"]', pwd, { delay: 50 });
    await page.evaluate(() => {
        document.querySelectorAll('div[role="button"]')[2].click()
    });
    await page.waitForNetworkIdle({ idleTime: 2000 });

    //await page.goto('https://twitter.com/KR_BlueArchive', { waitUntil: 'networkidle2' });
    await new Promise((page) => setTimeout(page, 10000));

    const tweets = await page.$$eval('article div[lang]', (tweetContents) => tweetContents.map((tweet) => tweet.textContent));

    console.log(tweets);
    
    await browser.close();
})();