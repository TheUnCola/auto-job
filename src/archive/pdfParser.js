let fs = require('fs'),
    path = require('path'),
    //Promise = require('bluebird'),
    PDFParser = require('pdf2json');

let pdfParser = new PDFParser();

//new Promise(function (fulfill) {
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {

        // let texts = pdfData.formImage.Pages[0].Texts,
        //     textsLen = texts.length,
        //     i = 0,
        //     invNumFound = false;
        // for (; i < textsLen; i++) {
        //     let text = texts[i];
        //     if (text.R[0].T === "Invoice%20Number%3A") {
        //         fs.renameSync(inputFolder + "/" + file, outputFolder + "/" + texts[i + 1].R[0].T + ".pdf");
        //         invNumFound = true;
        //         return fulfill(true);
        //     }
        // }
        // if (!invNumFound) {
        //     consoleLog("Invoice Number Not Found For " + file);
        //     return fulfill(true);
        // }

        fs.writeFileSync('pdfJson.json', JSON.stringify(pdfData));
    });

    pdfParser.loadPDF("../input" + "/" + "report_icr.pdf");
//});




