var fk,invFile,
    invoiceSummaryHTML = "../views/sicomReport.html",
    inputFolder = "../../input", outputFolder = "../../output",
    prev = 'Prev Step', next = 'Next Step';


let invoiceSummaryPages = [
    {
        page: "batchInvoiceSummary",
        funct: function() {},
        buttons: [
            {
                id: 'main',
                text: prev,
                first: true
            },
            {
                id: 1,
                text: next,
                first: false
            }],
        index: 0
    },
    {
        page: "googleSet",
        buttons: [
            { text: prev },
            { text: next }
            ],
        index: 1

    },
    {
        page: "googleDL",
        buttons: [
            { text: prev },
            { text: next }
        ],
        index: 2
    },
    {
        page: "googlePDF",
        buttons: [
            { text: prev },
            { text: next }
        ],
        index: 3
    },
    {
        page: "invoiceInput",
        funct: function() { getInvoiceInputFileList(); },
        buttons: [
            { text: prev },
            { text: next }
        ],
        submit: function() { invFile = $('#invoiceInputFile').find(":selected").text(); },
        index: 4
    },
    {
        page: "googleFunct",
        funct: function() { generateGoogleFunct(fk, invFile); },
        buttons: [
            { text: prev },
            { text: next }
        ],
        index: 5
    },
    {
        page: "runBatch",
        funct: function() { runPDFBatch(); },
        buttons: [
            { text: prev },
            { text: next }
        ],
        index: 6
    }
];

function initInvoiceSummary() {
    toggleMainPage(false);
    $('#tool-contents').load(invoiceSummaryHTML + ' #batchInvoiceSummary');
    invoiceSummaryPages[0].buttons.forEach(function(button) {
        addButton(button.id,button.text,button.first,"tool");
    });
}

$(document).on('click', event => {
    var buttonId = $(event.target).attr('id');
    checkToolPage(invoiceSummaryPages,invoiceSummaryHTML,buttonId,"button");
});

let getInvoiceInputFileList = function() {
    let fs = require('fs'),
        path = require('path'),
        Promise = require('bluebird');

    fs.readdir(inputFolder, function (err, files) {
        if (err) {
            consoleLog("Could not list the directory." + err);
            return "";
        }
        return Promise.each(files, function(file) {
            return new Promise(function(fulfill) {
                if (path.extname(file).toLowerCase() === ".xls" || path.extname(file).toLowerCase() === ".xlsx") {
                    $('#invoiceInputFile').append($('<option>', {
                        value: file,
                        text: file
                    }));
                    return fulfill(true);
                } else return fulfill(true);
            });
        });
    });

};

let parseInvoiceInputFile = function(file) {
    let XLSX = require('xlsx'),
        workbook = XLSX.readFile(inputFolder + "/" + file),
        sheet_name_list = workbook.SheetNames,
        xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    let invList = 'var invs = ["';
    xlData.forEach(function(row,index) {
        if(index === xlData.length) invList += row["Invoice matter id"] + '\"]';
        else invList += row["Invoice matter id"] + '\",\"';
    });
    return invList;
};

let generateGoogleFunct = function(fk, invFile) {

    let invs = parseInvoiceInputFile(invFile) + ";\n";
    let getFk = 'var url = new URL(this.document.location.href); var fk = url.searchParams.get(\"_fk_\")' + ";\n"; //Need to parse this string still!@#$%^&^%$#@!@#$%^*#@@$!%^$%^$$!$@!!
    let googleFunct = "for(var i = 0; i < invs.length; i++) {\n" +
        "\twindow.open(\"https://sop.cscglobal.com/pbng/invoiceMatterSummaryReport.mm?INVOICEMATTERID=\"+invs[i]+\"&_fk_=\"+fk);\n" +
        "}";

    $(document).ready(function () {
        $('#googleFunctText').append(invs + getFk + googleFunct);
    });
};

let runPDFBatch = function() { //Add batch log instead of consoleLog WE%^&%$#@$&$%^$#QWRFDXXZF#@%$$%^WTEG$%
    let fs = require('fs'),
        path = require('path'),
        Promise = require('bluebird'),
        PDFParser = require('pdf2json');

    fs.readdir(inputFolder, function (err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }
        files.forEach(function (file) {
            return new Promise(function (fulfill) {
                if(path.extname(file).toLowerCase() !== ".pdf") {
                    consoleLog(file + " is NOT a PDF");
                    return fulfill(true);
                } else {

                    let pdfParser = new PDFParser();

                    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
                    pdfParser.on("pdfParser_dataReady", pdfData => {

                        let texts = pdfData.formImage.Pages[0].Texts,
                            textsLen = texts.length,
                            i = 0,
                        invNumFound = false;
                        for (; i < textsLen; i++) {
                            let text = texts[i];
                            if (text.R[0].T === "Invoice%20Number%3A") {
                                fs.renameSync(inputFolder + "/" + file, outputFolder + "/" + texts[i + 1].R[0].T + ".pdf");
                                invNumFound = true;
                                return fulfill(true);
                            }
                        }
                        if (!invNumFound) {
                            consoleLog("Invoice Number Not Found For " + file);
                            return fulfill(true);
                        }
                    });

                    pdfParser.loadPDF(inputFolder + "/" + file);
                }
            });
        });
    });
};