const fs = require('node:fs');
const pdfDocument = require('pdfkit');

    const boss = require('./datas/bossParty.json');

    const doc = new pdfDocument({size: "A5",font: "font/Giants-Regular.otf", layout: 'landscape',
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

    const firstPos = 30;

    let Xpos = firstPos;
    let Ypos = firstPos;
    let numOfParties = 1;

    // INSANE party

    doc.fontSize(20)
        .text(`${boss[0].name} 인세인 조합`, Xpos, Ypos);
    
    Ypos += 50;
    
    for(const parties of boss[0].party_insane) {

        doc.fontSize(16)
            .text(`${numOfParties++} 파티`);
            
        Ypos += 10;
        
        for(let i=0; i<6; i++) {
            doc.image(`./Images/Students/Face/${parties[i]}.jpg`, Xpos, Ypos, {width: 80, height: 70})
                .fontSize(12)
                .text(`${parties[i]}`, Xpos, Ypos + 70, {width: 80, align: 'center'});
            Xpos += 90;
        }

        Xpos = firstPos;
        Ypos += 90;
    }

    doc.fontSize(14)
        .text(`${boss[0].coment_insane}`, Xpos, Ypos + 30);

    // TORMENT party

    doc.addPage();

    Xpos = firstPos; 
    Ypos = firstPos;

    doc.fontSize(18)
        .text(`${boss[0].name} 토먼트 조합`, Xpos, Ypos);

    doc.end();
