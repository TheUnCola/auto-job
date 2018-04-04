var nw = require("nw.gui");

$(document).ready(function() {
    initPage();

    nw.Window.get().focus();
});

// $(document).on('click', event => {
//     var buttonId = $(event.target).attr('id');
//     if(buttonId === "begin") {
//         initBrowser();
//         navigate("https://www.google.com");
//     } else if(buttonId === "rbi") {
//         initBrowser();
//         rbi();
//     } else if(buttonId === "sicom") {
//         initBrowser();
//         sicom();
//     }
//     } else if(buttonId === "sicomCSVConverter") {
//         // let CSVParser = require('./csvParser.js');
//
//         $('.btn-group-tools').hide();
//         getInputFileList();
//         $(document).ready(function () {
//             $('.sicomCSVConverter').show();
//         });
//     } else if(buttonId === "sicomInputFileSubmit") {
//         // let CSVParser = require('./csvParser.js');
//         $('#sicomInputFileSubmit').hide();
//         $(document).ready(function () {
//             buildCSV($('#sicomInputFile').val());
//             $('#sicomInputFile').hide();
//         });
//     }
// });