const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadImage(URL, imagePath) {
    console.log('downloadImage 이상 무');
    try {
        const response = await fetch(URL);
        const arraybuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arraybuffer);

        fs.writeFileSync(imagePath, buffer);
        console.log('Image saved successfully');
    } catch (error) {
        console.log(`Failed to download image from ${URL} : ${error.message}`);
    }
}

module.exports = { downloadImage };