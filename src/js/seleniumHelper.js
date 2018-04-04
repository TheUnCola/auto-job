//let webdriver = require('selenium-webdriver');
const {Builder, By, Key, until} = require('selenium-webdriver');
const Promise = require('bluebird');
var driver;

let logTitle = function() {
    driver.getTitle().then(function (title) {
        console.log('Current Page Title: ' + title);
    });
};


let handleFailure = function(err) {
    console.error('Something went wrong\n', err.stack, '\n');
    this.closeBrowser();
};

let closeBrowser = function() {
    driver.quit();
};

let initBrowser = function () {
    // browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome'}).build();
    driver = new Builder().forBrowser('chrome').build();
    /*return new Promise(function (fulfill, reject) {
        //driver = new Builder().forBrowser('chrome').build();
        setTimeout(function(){
            return fulfill(true);
        }, 5000);
        // $(document).ready(function () {
        //
        // })
    })*/
};

let navigate = function (url) {
    return new Promise(function (fulfill, reject) {
        return driver.get(url)
            .then(fulfill);
            /*.then(function () {
                $(document).ready(function () {
                    return fulfill(true);
                })
                // driver.waitForUrl(url, 10 * 1000)
                //     .then(fulfill);
            });*/
    });
};

// let waitForURL = function (url) {
//     return new Promise(function (fulfill, reject) {
//         return driver.waitForUrl(url, 10 * 1000)
//             .then(fulfill);
//     });
// };

let enterData = function (data, ref, refType) {
    return new Promise(function (fulfill, reject) {
        if(refType === 'id') {
            return driver.wait(until.elementLocated(By.id(ref)), 5 * 1000).then(el => {
                return el.sendKeys(data)
                    .then(fulfill);
            });
        } else if(refType === 'name') {
            return driver.wait(until.elementLocated(By.name(ref)), 5 * 1000).then(el => {
                return el.sendKeys(data)
                    .then(fulfill);
            });
        }
    });
};

let selectOption = function (data, ref, refType) {
    return new Promise(function (fulfill, reject) {
        if(refType === 'id') {
            return driver.wait(until.elementLocated(By.id(ref)), 5 * 1000).then(el => {
                return el.findElements(By.linkText(data)).click()
                    .then(fulfill);
            });
        } else if(refType === 'name') {
            return driver.wait(until.elementLocated(By.name(ref)), 5 * 1000).then(el => {
                return el.findElements(By.linkText(data)).click()
                    .then(fulfill);
            });
        }
    });
};

let clickButton = function(ref, refType) {
    return new Promise(function (fulfill, reject) {
        if(refType === 'id') {
        return driver.wait(until.elementLocated(By.id(ref)), 5 * 1000).then(el => {
            return el.click()
                .then(fulfill);
        });
        } else if(refType === 'name') {
            return driver.wait(until.elementLocated(By.name(ref)), 5 * 1000).then(el => {
                return el.click()
                    .then(fulfill);
            });
        }
    });
};

let opRouter = function(step,procName) {
    consoleLog(step.op);
    consoleLog(step.url);
    switch(step.op) {
        case "navigate":
            navigate(step.url);
            break;
        case "login":
            let user = require('../cred.json')[procName];
            enterData(user.user,step.user.ele,step.user.type)
                .then(enterData(user.pass,step.pass.ele,step.pass.type))
                .then(clickButton(step.button.ele,step.button.type));
            break;
        case "wait":

            $(driver.getElement()).ready(function () {
                consoleLog("Ready");
            });
            break;
        case "click":
            clickButton(step.ele,step.type);
            break;
        default:
            consoleLog("No Route Exists");
            break;
    }
};

let doProcess = function (name) {
    initBrowser();
    let processes = require('../processes.json'),
        process = processes[name];
//consoleLog(JSON.stringify(process));
    return Promise.each(process.steps, function(step) {
        return new Promise(function(fulfill) {
            consoleLog(step);
            opRouter(step,process.name);
            return fulfill(true);
        });
    }).then(function () {
        consoleLog("Done Steps");
    })
};