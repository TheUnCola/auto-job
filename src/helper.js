//let webdriver = require('selenium-webdriver');
const {Builder, By, Key, until} = require('selenium-webdriver');
const Promise = require('bluebird');
var browser;

let logTitle = function() {
    browser.getTitle().then(function (title) {
        console.log('Current Page Title: ' + title);
    });
};



let handleFailure = function(err) {
    console.error('Something went wrong\n', err.stack, '\n');
    this.closeBrowser();
};

let closeBrowser = function() {
    browser.quit();
};

let initBrowser = function () {

    // browser = new webdriver.Builder().usingServer().withCapabilities({'browserName': 'chrome'}).build();
    browser = new Builder().forBrowser('chrome').build();
};

let navigate = function (url, element) {
    browser.get(url);

    // return new Promise(function (fulfill, reject) {
    //     return browser.wait(function () {
    //         return browser.elemen
    //     })
    // });
};

let enterData = function (data, id) {
    return new Promise(function (fulfill, reject) {
        return browser.wait(until.elementLocated(By.id(id)), 5 * 1000).then(el => {
            return el.sendKeys(data)
                .then(fulfill);
        });
    });
};

let clickButton = function(id) {
    return new Promise(function (fulfill, reject) {
        return browser.wait(until.elementLocated(By.id(id)), 5 * 1000).then(el => {
            return el.click()
                .then(fulfill);
        });
    });
};

let facebook = function() {
    browser.get("https://www.facebook.com/");

    enterData('email123','email')
        .then(enterData('pass123','pass'))
        .then(clickButton('loginbutton'));


    // var email = browser.findElement(By.id('email'));
    // email.sendKeys('email123');
    //
    // var pass = browser.findElement(By.id('pass'));
    // pass.sendKeys('pass123');
    //
    // pass.submit();
};