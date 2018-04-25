import { app, BrowserWindow, ipcMain, dialog } from 'electron';
const fs = require('fs');
const Promise = require('bluebird');
const {Builder, By, Key, until} = require('selenium-webdriver');
import path from 'path';
import url from 'url';
import './dev-extensions';
import ipcRenderer = Electron.ipcRenderer;
import {first} from "rxjs/operator/first";

declare const DEV_SERVER: boolean;

const indexUrl = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win, popWin, driver;

function createWindow() {

  const width = 600, height = 750;

  // Create the browser window.
  win = new BrowserWindow({
    center:true,
    width: width,
    height: height,
    icon: "../assets/img/csc.png",
    resizable: false,
    autoHideMenuBar:true
  });

  // and load the index.html of the app.
  win.loadURL(indexUrl);

  // Open the DevTools.
  if (DEV_SERVER) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;

  });
}

/*function createPopupBrowser() {

  const width = 800, height = 750;

  // Create the browser window.
  popWin = new BrowserWindow({
    center:true,
    width: width,
    height: height,
    icon: "../assets/img/csc.png",
    resizable: false,
    autoHideMenuBar:true
  });

  // and load the index.html of the app.
  popWin.loadURL("https://my.cscglobal.com/cscportal/login.pwd");

  // Open the DevTools.
  if (DEV_SERVER) {
    popWin.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  popWin.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    popWin = null;

  });
}*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
    process.exit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('open-file-dialog-for-file', function (event) {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function (files) {
    //if (files) event.sender.send('selected-file', files[0]);
    if (files) event.returnValue = files[0];
  });
});

let buildCSV = function(inputFile) {

  let csvOutput = "", fieldsKnown = false, firstStore = true,
    numField,nameField,unitField,osField,skipBlankArrayIndex,wasteField,amtOSField,
    wasteTotal = [],amtOSTotal = [];

  let stores = ['544','10740','3346','6466'],storeCount = 0;
  let rowHead = ["NUM", "NAME", "UNIT"], storeRows = [], storeString = "";

  //Building Buffer (Blank) Values
  for(let j = 0; j < rowHead.length; j++) {
    if(j === 0) {
      storeString += "Yesterday's Date (still need to add)";
    } else storeString += ",";
  }
  //Building Rest Of Header String Based On Number Of Stores
  for(let i = 0; i < stores.length; i++) {
    //Init StoreRows Array
    storeRows[i] = [];

    if(i === 0) storeString += stores[i];
    else storeString += "," + stores[i];
  }
  console.log("Hit BuildCSV");
  const csv=require('csvtojson');
  csv()
    .fromFile(inputFile)
    .on("end_parsed",function(jsonObjArray){ //when parse finished, result will be emitted here.
      return Promise.each(jsonObjArray, function(jsonObj) {
        return new Promise(function (fulfill) {
          if(fieldsKnown && (jsonObj[numField] !== "" || jsonObj[nameField] !== "") && !skipBlankArrayIndex) { //Inner Row
            storeRows[storeCount].push([jsonObj[numField],jsonObj[nameField],jsonObj[unitField],jsonObj[osField]]);
          } else if(fieldsKnown && jsonObj[numField] === "" && jsonObj[nameField] === "" && !skipBlankArrayIndex) { //Totals Row
            wasteTotal[storeCount] = jsonObj[wasteField];
            amtOSTotal[storeCount] = jsonObj[amtOSField];
            fieldsKnown = false;
            skipBlankArrayIndex = true;
          } else if(skipBlankArrayIndex) { //Blank Row
            skipBlankArrayIndex = false;
          } else if(!fieldsKnown) { //Header Row
            if(!firstStore) storeCount++;
            else firstStore = false;
            Object.keys(jsonObj).forEach(function (key) {
              if(jsonObj[key] === "NUM") numField = key;
              else if(jsonObj[key] === "NAME") nameField = key;
              else if(jsonObj[key] === "UNIT") unitField = key;
              else if(jsonObj[key] === "WASTE") wasteField = key;
              else if(jsonObj[key] === "O/S") osField = key;
              else if(jsonObj[key] === "Amt O/S") amtOSField = key;
            });
            fieldsKnown = true;
          }
          return fulfill(true);
        });
      }).then(function () {
        csvOutput += storeString + "\n";

        //Outputting Header Row
        rowHead.forEach(function (header) {
          csvOutput += header + ",";
        });
        stores.forEach(function(store,sIndex) {
          csvOutput += "O/S";
          if(sIndex < stores.length - 1) csvOutput += ",";
        }); csvOutput += "\n";

        //Error Checks
        if(!(storeRows[0].length === storeRows[1].length && storeRows[1].length === storeRows[2].length &&
          storeRows[2].length === storeRows[3].length && storeRows[3].length === storeRows[0].length))
          console.error("Number of fields not equal");

        //Initial Common Values Compared Against All Stores
        for(let row = 0; row < storeRows[0].length; row++) {
          stores.forEach(function (store, sIndex) {
            for(let rowField = 0; rowField < storeRows[sIndex][row].length - 1; rowField++) {
              if(storeRows[sIndex][row][rowField] !== storeRows[0][row][rowField])
                console.error("Init Values Off!");
            }
          });
        }

        //Fill in Inner Row Data From Stores
        for(let row = 0; row < storeRows[0].length; row++) {
          //k is current index of row for all stores
          let rowString = "";
          storeRows.forEach(function (store,sIndex) {
            if(sIndex === 0) {
              rowHead.forEach(function (header, hIndex) {
                rowString += store[row][hIndex] + ",";
              });
            }
            rowString += store[row][store[row].length - 1];
            if(sIndex < storeRows.length - 1) rowString += ","
          });
          csvOutput += rowString + "\n";
        }

        csvOutput += blankRow(rowHead.length + stores.length);
        csvOutput += blankRow(rowHead.length + stores.length);

        csvOutput += ",Total Dollars,,";
        stores.forEach(function(store,sIndex) {
          csvOutput += amtOSTotal[sIndex];
          if(sIndex < stores.length - 1) csvOutput += ",";
        }); csvOutput += "\n";

        csvOutput += blankRow(rowHead.length + stores.length);

        csvOutput += ",Total Waste Dollars,,";
        stores.forEach(function(store,sIndex) {
          csvOutput += wasteTotal[sIndex];
          if(sIndex < stores.length - 1) csvOutput += ",";
        });

        fs.unlinkSync(inputFile);
        fs.writeFileSync(inputFile, csvOutput);
      });
    });
};

let blankRow = function (length) {
  let blankRow = "";
  for(let blank = 0; blank < length; blank++) {
    blankRow += ",";
  }
  return blankRow + "\n";
};

ipcMain.on('build-csv', function (event,args) {
  buildCSV(args[0]);
  event.returnValue = true;
});



// Selenium

let initBrowser = function () {
  driver = new Builder().forBrowser('chrome').build();
};

let maximize = function () {
  return new Promise(function (fulfill, reject) {
    return driver.manage().window().maximize()
      .then(fulfill);
  });
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

let focusTopFrame = function () {
  return new Promise(function (fulfill, reject) {
    return driver.switchTo().defaultContent()
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
        return el.findElements(By.xpath('./option[contains(.,"'+ opt +'")]'))
          .then(function(optionsList) {
            return optionsList[0].click()
              .then(fulfill);
          });
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

let opRouter = function(step,procName) {
  console.log(step.op);
  console.log(step.url);
  switch(step.op) {
    case "navigate":
      navigate(step.url);
      break;
    case "login":
      let user = require('../assets/cred.json')[procName];
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
    case "topframe":
      focusTopFrame();
      break;
    case "select":
      selectOption(step.ele,step.type,step.option);
      break;
    default:
      console.log("No Route Exists");
      break;
  }
};

let doProcess = function (name) {

  initBrowser();
  maximize();
  let process/*es*/ = require('../assets/processes.json')[name]/*,
    process = processes[name]*/;
  return Promise.each(process.steps, function(step) {
    return new Promise(function(fulfill) {
      console.log(step);
      return driver.wait(function () {
        return driver.executeScript("return document.readyState")
          .then(function (status) {
            return status === "complete";
          });
      }, 3000)
        .then(opRouter(step,process.name))
        .then(fulfill)
    });
  }).then(function () {
    console.log("Done Steps");

  })
};

ipcMain.on('do-process', function (event,args) {
  doProcess(args[0]);
});

ipcMain.on('get-process-list', function (event) {
  let processes = require('../assets/processes.json'), processList = [];
  Object.keys(processes).forEach(function (key) {
    processList.push(key);
  });
  event.returnValue = processList;
});


