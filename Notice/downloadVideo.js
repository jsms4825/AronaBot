const cheerio = require('cheerio');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

async function downloadVideo(src, path) {
    try{
        ffmpeg(src)
            .output(path)
            .on('end', () => {
                console.log('Video downloaded and converted successfully');
            })
            .on('error', (err) => {
                console.error('Error downloading or converting video:', err);
            })
            .run();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = { downloadVideo };