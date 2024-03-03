const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const appPath = process.cwd();
const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

async function scrapeTweet() {
    const browser = await puppeteer.launch();
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

    await page.goto('https://twitter.com/KR_BlueArchive', { waitUntil: 'networkidle2' });

    const tweet = await page.$eval('article', (article) => {
        const text = article.querySelector('div[lang]').textContent;
        const imagesArray = Array.from(article.querySelectorAll('img'));
        const convertImages = imagesArray.map(img => img.src);
        const images = convertImages.filter(img => !img.includes('svg'));

        return {text, images};
    });

    let data = '';

    try {
        data = fs.readFileSync(`${appPath}/Notice/currentData/currentTweet.txt`, 'utf8');
    } catch(error) {
        console.log(error);
    }

    if(tweet.text != data) {

        try {
            fs.writeFileSync(`${appPath}/Notice/currentData/currentTweet.txt`, tweet.text, 'utf8');
        } catch(error) {
            console.log(error);
        }

        for(let i=1; i<tweet.images.length; i++) {
            const imageURL = tweet.images[i];
            const imageName = `Image_${i}.jpg`;
            const imagePath = path.join(__dirname, `/currentData/${imageName}`);

            await require(`${appPath}/Notice/ImageDownloader.js`).downloadImage(imageURL.replace('small', 'large'), imagePath);
        }

        await browser.close();
        return tweet;
    } else {
        console.log('The tweet already exists.');
        await browser.close();
        return;
    }
};

module.exports = { scrapeTweet };