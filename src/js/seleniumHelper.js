//let webdriver = require('selenium-webdriver');
const {Builder, By, Key, until} = require('selenium-webdriver');
const Promise = require('bluebird');
var driver;

let handleFailure = function(err) {
    console.error('Something went wrong\n', err.stack, '\n');
    driver.quit();
};

let initBrowser = function () {
    // browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome'}).build();
    driver = new Builder().forBrowser('chrome').build();
};

let navigate = function (url) {
    return new Promise(function (fulfill, reject) {
        return driver.get(url)
            .then(fulfill);
    });
};

let focusFrame = function (ref, refType) {
    return new Promise(function (fulfill, reject) {
        return driver.switchTo().frame(ref)
            .then(fulfill)
    });
};

let focusParentFrame = function () {
    return new Promise(function (fulfill, reject) {
        return driver.switchTo().parentFrame()
            .then(fulfill)
    });
};

let enterData = function (data, ref, refType) {
    return new Promise(function (fulfill, reject) {
        return driver.wait(until.elementLocated(By[refType](ref)), 5* 1000)
            .then(el => {
                return el.sendKeys(data)
                    .then(fulfill)
            });
    });
};

let selectOption = function (ref, refType, opt) {
    return new Promise(function (fulfill, reject) {
        return driver.wait(until.elementLocated(By[refType](ref)), 5* 1000)
            .then(el => {
                return el.findElements(By.linkText(opt)).click()
                    .then(fulfill);
            });
    });
};

let click = function(ref, refType) {
    return new Promise(function (fulfill, reject) {
        if(refType !== "xpath") {
            return driver.wait(until.elementLocated(By[refType](ref)), 5 * 1000)
                .then(el => {
                    return el.click()
                        .then(fulfill);
                });
        } else {
            return driver.wait(driver.findElement(By.xpath(ref)), 5 * 1000)
                .then(el => {
                    return el.click()
                        .then(fulfill);
                });
        }
    });
};

// let clickCheckBox = function(ref, refType) {
//     return new Promise(function (fulfill, reject) {
//         return untilElementLocated(ref,refType).click()
//             .then(fulfill);
//     });
// };

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
                .then(click(step.button.ele,step.button.type));
            break;
        case "wait":

            // $(driver.getElement()).ready(function () {
            //     consoleLog("Ready");
            // });
            break;
        case "click":
            click(step.ele,step.type);
            break;
        case "frame":
            focusFrame(step.ele,step.type);
            break;
        case "parentframe":
            focusParentFrame();
            break;
        case "select":
            selectOption(step.ele,step.type,step.option);
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
            return driver.wait(function () {
                return driver.executeScript("return document.readyState")
                    .then(function (status) {
                        return status === "complete";
                    });
                }, 1000)
                .then(opRouter(step,process.name))
                .then(fulfill)
            });
    }).then(function () {
        consoleLog("Done Steps");
    })
};