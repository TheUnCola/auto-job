let XLSX = require('xlsx'),
    workbook = XLSX.readFile("../input" + "/" + "report.xlsx"),
    sheet_name_list = workbook.SheetNames,
    xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

var fs = require('fs');

fs.writeFileSync('excelJson.json', JSON.stringify(xlData));

