var nw = require("nw.gui");


$(document).ready(function(){

    initPage();


    //pageDirectory.add(sicomReportPages);

    nw.Window.get().focus();
});

/*$(document).on('click', event => {

    var buttonId = $(event.target).attr('id');
    consoleLog(buttonId);
    pageDirectory[0].buttons.forEach(function (button) {
        //consoleLog(buttonId);
        if(buttonId === button.id) {
            button.funct();
        }
    });

});*/
