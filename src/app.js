var nw = require("nw.gui");

$(document).ready(function() {


    nw.Window.get().focus();
});

$(document).on('click', event => {
    var buttonId = $(event.target).attr('id');
    if(buttonId === "begin") {
        initBrowser();
        navigate("https://www.google.com");
    } else if(buttonId === "facebook") {
        initBrowser();
        facebook();
    }
});