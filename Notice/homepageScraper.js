const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { text } = require('pdfkit');
require('dotenv').config();

const appPath = process.cwd();

async function scrapeNotice() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Connect game homepage
    await page.goto('https://forum.nexon.com/bluearchive/board_list?board=1018', { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 1280, height: 800 });

    await page.waitForSelector('#contents > div.section-bot > div.list-box > ul > li:nth-child(1) > a > h3');
    await page.click('#contents > div.section-bot > div.list-box > ul > li:nth-child(1) > a > h3');

    await page.waitForSelector('div[class="contents-box"]');

    const notice = await page.$eval('div[class="contents-box"]', (content) => {
        const textArray = Array.from(content.querySelectorAll('p'));
        const texts = textArray.map(txt => txt.textContent);
        
        const imagesArray = Array.from(content.querySelectorAll('img'));
        const images = imagesArray.map(img => img.src);

        return {texts, images};
    });

    let currentURL;

    try {
        currentURL = fs.readFileSync(`${appPath}/Notice/currentData/currentNotice.txt`, 'utf8');
    } catch(error) {
        console.log(error);
    }

    if(page.url() != currentURL) {

        try {
            fs.writeFileSync(`${appPath}/Notice/currentData/currentNotice.txt`, page.url(), 'utf8');
        } catch(error) {
            console.log(error);
        }

        /*
        for(let i=0; i<notice.images.length; i++) {
            const imageURL = notice.images[i];
            const imageName = `Image_${i}.jpeg`;
            const imagePath = path.join(__dirname, `/currentData/${imageName}`);
            await require(`${appPath}/Notice/ImageDownloader.js`).downloadImage(imageURL, imagePath);
        } */

        await browser.close();
        return notice;

    } else {
        console.log('The notice already exists.');
    }

    await page.waitForNetworkIdle({ idleTime: 2000 });
    await browser.close();
};

module.exports = { scrapeNotice };