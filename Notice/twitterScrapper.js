const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const os = require('os');

require('dotenv').config();
const osPlatform = os.platform();
const appPath = process.cwd();

async function scrapeTweet() {

    let executablePath;
    if(/^win/i.test(osPlatform)) {
        executablePath = 'C:\\Users\\jsms4\\AppData\\Local\\Chromium\\Application\\chrome.exe';
    } else if(/^linux/i.test(osPlatform)) {
        executablePath = '/usr/bin/chromium-browser';
    }

    const browser = await puppeteer.launch({
        headless: false,
	    //args: ['--no-sandbox', "--disabled-setupid-sandbox"],
	    executablePath: executablePath
    });
    const page = await browser.newPage();

    const username = process.env.X_ID;
    const pwd = process.env.X_PWD;
    const phonenumber = process.env.X_PHONE;

    // Login
    await page.goto('https://twitter.com/i/flow/login', { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 1280, height: 800 });

    // input ID
    await page.waitForSelector('[autocomplete="username"]');
    await page.type('input[autocomplete="username"]', username, { delay: 50 });
    await page.evaluate(() => {
        document.querySelectorAll('div[role="button"]')[2].click()
    });

    await page.waitForNetworkIdle({ idleTime: 1000 });

    // input pwd
    await page.waitForSelector('[autocomplete="current-password"]');
    await page.type('input[autocomplete="current-password"]', pwd, { delay: 50 });
    await page.evaluate(() => {
        document.querySelectorAll('div[role="button"]')[2].click()
    });

    await page.waitForNetworkIdle({ idleTime: 1000 });

    // If twitter requires phone number, input phone number

    const extractedText = await page.$eval("*", (el) => el.innerText);
    if(extractedText.includes('휴대전화 번호를 입력')) {
        await page.waitForSelector('[autocomplete="on"]');
        await page.type('input[autocomplete="on"]', phonenumber, { delay: 50 });
        await page.evaluate(() => 
            document.querySelectorAll('div[role="button"]')[1].click()
        );
        await page.waitForNetworkIdle({ idleTime: 2000 });
    }

    await page.goto('https://twitter.com/KR_BlueArchive', { waitUntil: 'networkidle0' });

    const tweet = await page.$eval('article', (article) => {
        const text = article.querySelector('div[lang]').textContent;
        const imagesArray = Array.from(article.querySelectorAll('img'));
        const convertImages = imagesArray.map(img => img.src);
        const images = convertImages.filter(img => !img.includes('svg'));

        return {text, images};
    });

    let data = '';
    console.log(tweet);
    console.log(appPath);

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
