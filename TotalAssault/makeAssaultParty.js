const fs = require('node:fs');
const pdfDocument = require('pdfkit');
const firstPos = 30;

let Xpos = firstPos;
let Ypos = firstPos;
let numOfParties = 1;

const A4_X = 841.89;
const A4_Y = 595.28;

    // create PDF file

    const boss = require('./datas/bossParty.json');
    const doc = new pdfDocument({size: "A4", font: "font/Giants-Regular.otf", layout: 'landscape',
                                margins: {
                                    top: 30,
                                    left: 30,
                                    right: 30,
                                    bottom: 30
                                }});
    const ExportedFilePath = `./${boss[0].name}_party.pdf`;

    if (fs.existsSync(ExportedFilePath))
        fs.unlinkSync(ExportedFilePath);

    doc.pipe(fs.createWriteStream(ExportedFilePath));

    // INSANE party

    doc.opacity(0.25)
        .image(`./Images/Boss/${boss[0].name}.jpeg`, -90, 25, {height: A4_Y - 50});
    doc.opacity(1);
    doc.image('./Images/Blue_Archive.svg.png', 650, 520, {scale: 0.35})
    doc.polygon([0, 15], [500, 15], [450, 70], [0, 70])
        .fill("#098bfa");
    doc.stroke();

    doc.fontSize(32)
        .fillColor("#272727")
        .text(`${boss[0].name} 인세인 조합`, Xpos, Ypos - 10);
    Ypos += 80;
    
    for(const parties of boss[0].party_insane) {

        doc.fontSize(20)
            .text(`${numOfParties++} 파티`, Xpos, Ypos);
            
        Ypos += 30;
        
        for(let i=0; i<6; i++) {
            doc.image(`./Images/Students/Face/${parties[i]}.jpg`, Xpos, Ypos, {width: 120, height: 100})
                .fontSize(16)
                .text(`${parties[i]}`, Xpos, Ypos + 100, {width: 120, align: 'center'});
            Xpos += 130;
        }

        Xpos = firstPos;
        Ypos += 140;

        if(Ypos + 180 >= A4_Y) {
            addPage(doc);
            Ypos = firstPos;
            doc.fontSize(32)
                .fillColor("#272727")
                .text(`${boss[0].name} 인세인 조합`, Xpos, Ypos - 10);
            Ypos += 80;
        }
    }

    doc.fontSize(16)
        .text(`${boss[0].coment_insane}`, Xpos, Ypos);

    // TORMENT party

    addPage(doc);
    Ypos = firstPos;
    numOfParties = 1;

    doc.fontSize(32)
        .fillColor("#272727")
        .text(`${boss[0].name} 토먼트 조합`, Xpos, Ypos - 10);
    Ypos += 80;

    for(const parties of boss[0].party_torment) {

        doc.fontSize(20)
            .text(`${numOfParties++} 파티`, Xpos, Ypos);
            
        Ypos += 30;
        
        for(let i=0; i<6; i++) {
            doc.image(`./Images/Students/Face/${parties[i]}.jpg`, Xpos, Ypos, {width: 120, height: 100})
                .fontSize(16)
                .text(`${parties[i]}`, Xpos, Ypos + 100, {width: 120, align: 'center'});
            Xpos += 130;
        }

        Xpos = firstPos;
        Ypos += 140;

        if(Ypos + 180 >= A4_Y) {
            addPage(doc);
            Ypos = firstPos;
            doc.fontSize(32)
                .fillColor("#272727")
                .text(`${boss[0].name} 토먼트 조합`, Xpos, Ypos - 10);
            Ypos += 80;
        }
    }

    doc.fontSize(16)
        .text(`${boss[0].coment_torment}`, Xpos, Ypos);

    doc.end();

function addPage(doc) {
    doc.addPage();
    doc.opacity(0.25)
        .image(`./Images/Boss/${boss[0].name}.jpeg`, -90, 25, {height: A4_Y - 50});
    doc.opacity(1);
    doc.image('./Images/Blue_Archive.svg.png', 650, 520, {scale: 0.35});
    doc.polygon([0, 15], [500, 15], [450, 70], [0, 70])
        .fill("#098bfa");
    doc.stroke();
    doc.fill('black');
}