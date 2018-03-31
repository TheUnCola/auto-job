let fs = require('fs');
const inputFile="../input" + "/" + "report.csv";
let outputFile="../output" + "/" + "report.csv";
let Promise = require('bluebird');

let csvOutput = "", fieldsKnown = false, firstStore = true,
    numField,nameField,unitField,osField,skipBlankArrayIndex,wasteField,amtOSField,
    wasteTotal = [],amtOSTotal = [];

let stores = ['544','10740','3346','6466'],storeCount = 0;
let rowHead = ["NUM", "NAME", "UNIT"], storeRows = [], storeString = "";


let buildCSV = function() {
    //Building Buffer (Blank) Values
    for(let j = 0; j < rowHead.length; j++) {
        storeString += ",";
    }
    //Building Rest Of Header String Based On Number Of Stores
    for(let i = 0; i < stores.length; i++) {
        //Init StoreRows Array
        storeRows[i] = [];

        if(i === 0) storeString += stores[i];
        else storeString += "," + stores[i];
    }

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

                fs.writeFileSync(outputFile, csvOutput);
                fs.unlinkSync(inputFile);

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

buildCSV();