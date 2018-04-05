let pageDirectory = [], currentPageIndex;

let initPage = function() {
    pageDirectory = [
        {
            page: "main",
            buttons: [
                {
                    id: "sicomReport",
                    text: 'Sicom Report',
                    first: true,
                    funct: function () {
                        initSicomReport();
                    }
                },
                {
                    id: 'sicomSelen',
                    text: 'Sicom Selenium',
                    first: false,
                    funct: function () {
                        doProcess("sicom");
                    }
                },
                {
                    id: 'rbiSelen',
                    text: 'RBI Selenium',
                    first: false,
                    funct: function () {
                        doProcess("rbi");
                    }
                }],

            index: 0
        }
    ];

    pageDirectory[0].buttons.forEach(function (button) {
        addButton(button.id, button.text, button.first, "main");
    });
};

$(document).on('click', '.btn-group-tools', event => {

    var buttonId = $(event.target).attr('id');
    pageDirectory[0].buttons.forEach(function (button) {
        if (button.id === buttonId) {
            button.funct();
        }
    });
});

let toggleMainPage = function(toggleOn) {
    if(toggleOn) {
        $('.btn-group-tools').show();
        $('.tool-header').hide();
        $('#tool-contents').empty();

        clearBottomButtons();
    } else {
        $('.btn-group-tools').hide();
        $('.tool-header').show();

        $('.tool-header').load(sicomReportHTML + " #tool-header");
    }
};

let addButton = function(id, text, firstButton, type) {
    if(type === "main") {
        if(firstButton) $('.btn-group-tools').html("");
        $('.btn-group-tools').append('<button id="' + id +'">' + text + '</button>');
    } else if(type === "tool") {
        if(firstButton) clearBottomButtons();
        else $('.btn-group-bottom').append('&nbsp;');
        $('.btn-group-bottom').append('<button id="' + id +'">' + text + '</button>');
    }
};

let clearBottomButtons = function() {
    $('.btn-group-bottom').html("");
};

let consoleLog = function(log) {
    $('.console-log').append('<p>' + JSON.stringify(log) + '</p>');
};

let updatePage = function(pageData, helperHTML, type) {
    if(type === "tool") $('#tool-contents').load(helperHTML + " #" + pageData.page);

    let buttonId, buttonFirst;
    pageData.buttons.forEach(function(button, index) {

        if(button.text === "Prev Step") buttonId = pageData.index - 1;
        else if(button.text === "Next Step") buttonId = pageData.index + 1;
        else if(button.id) buttonId = button.id;

        if(button.first) buttonFirst = button.first;
        else if(index === 0) buttonFirst = true;
        else buttonFirst = false;

        addButton(buttonId,button.text,buttonFirst,type)
    });
};

let checkToolPage = function(pages,helperHTML,data,type) {
    if(data === "main") {
        toggleMainPage(true);
    } else {
        pages.forEach(function(page, index) {
            if(page.index === parseInt(data) && type === "button") {
                if(pages[index-1] && pages[index-1].submit) pages[index-1].submit();

                updatePage(page, helperHTML, "tool");

                $(document).ready(function () {
                    if(page.funct) page.funct();
                });
                currentPageIndex = page.index;
            } else if(index === pages.length) {
                consoleLog("Hit End Of Page List");
            }
        });
    }
};

let getCurrentPage = function() {
    return currentPageIndex;
};