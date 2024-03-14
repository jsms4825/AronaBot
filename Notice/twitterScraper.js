const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const appPath = process.cwd();

async function scrapeTwitter() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const X_ID = process.env.X_ID;
    const X_PWD = process.env.X_PWD;

    // Connect twitter site
    await page.goto('https://twitter.com/i/flow/login', { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 1280, height: 800 });

    // Try to login in Twitter (input ID)
    await page.waitForSelector('[autocomplete="username"]');
    await page.type('input[autocomplete="username"]', X_ID, { delay: 50 });
    await page.evaluate(() =>
        document.querySelectorAll('div[role="button"]')[2].click()
    );
    await page.waitForNetworkIdle({ idleTime: 1500 });

    // Try to login in Twitter (input password)
    await page.waitForSelector('[autocomplete="current-password"]');
    await page.type('input[autocomplete="current-password"]', X_PWD, { delay: 50 });
    await page.evaluate(() =>
        document.querySelectorAll('div[role="button"]')[2].click()
    );
    await page.waitForNetworkIdle({ idleTime: 1500 });

    // Connect tweet of blue archive account
    await page.goto('https://twitter.com/KR_BlueArchive', { waitUntil: 'networkidle2' });

    const tweet = await page.$eval('article', (content) => {
        const text = content.querySelector('div[data-testid="tweetText"]').textContent;
        const imagesArray = Array.from(content.querySelectorAll('img'));
        const images = [];
        
        imagesArray.forEach(img => {
            const src = img.src;
            if(!src.includes('svg') && !src.includes('profile_images'))
                images.push(src);
        })

        return {text, images};
    });

    let currentTweet;

    try {
        currentTweet = fs.readFileSync(`${appPath}/Notice/currentData/currentNotice.txt`, 'utf8');
    } catch(error) {
        console.log(error);
    }

    if(tweet.text != currentTweet) {

        try {
            fs.writeFileSync(`${appPath}/Notice/currentData/currentNotice.txt`, tweet.text, 'utf8');
        } catch(error) {
            console.log(error);
        }

        await browser.close();
        return tweet;

    } else {
        console.log('The notice already exists.');
    }

    await page.waitForNetworkIdle({ idleTime: 2000 });
    await browser.close();
};

module.exports = { scrapeTwitter };