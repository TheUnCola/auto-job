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
};

let navigate = function (url) {
    return new Promise(function (fulfill, reject) {
        return driver.get(url)
            .then(function () {
                driver.waitForUrl(url, 10 * 1000)
                    .then(fulfill);
            });
    });
};

let waitForURL = function (url) {
    return new Promise(function (fulfill, reject) {
        return driver.waitForUrl(url, 10 * 1000)
            .then(fulfill);
    });
};

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

let clickButton = function(id, refType) {
    return new Promise(function (fulfill, reject) {
        if(refType === 'id') {
        return driver.wait(until.elementLocated(By.id(id)), 5 * 1000).then(el => {
            return el.click()
                .then(fulfill);
        });
        } else if(refType === 'name') {
            return driver.wait(until.elementLocated(By.name(id)), 5 * 1000).then(el => {
                return el.click()
                    .then(fulfill);
            });
        }
    });
};

let rbi = function() {
    driver.get("https://rbi.okta.com/");

    enterData('dsell00','okta-signin-username','id')
        .then(enterData('Whopper2731!','okta-signin-password','id'))
        .then(clickButton('okta-signin-submit'));
};

let sicom = function () {
    driver.get("https://summerwood.sicomasp.com/login.php?redirect=1");

    enterData('donna','XXX_login_name','name')
        .then(enterData('Pine+3346','XXX_login_password','name'))
        .then(clickButton('login','id'));

    clickButton('sales-button','id')
        .then(navigate("https://summerwood.sicomasp.com/wrapper.php?incoming=wrapper_prompt_icr.php%3F&name=Inventory and Cash (ICR)&helpname=PROMPTS&appid=114"))
        .then(selectOption("Yesterday","range__date_selector__start__end","name"));

};