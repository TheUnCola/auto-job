import { Component } from '@angular/core';
import { SeleniumModel } from "./selenium.model";
import { ipcRenderer, clipboard } from 'electron';

@Component({
  selector: 'app-selenium',
  templateUrl: './selenium.component.html',
  styleUrls: ['./selenium.component.css']
})
export class SeleniumComponent {

  items: any[];
  assets: any;
  // invListFile: any;
  model = new SeleniumModel();
  isCopied: boolean;
  isFileChosen: boolean;
  isDirChosen: boolean;
  isDirEmpty: boolean;
  isInputDirChosen: boolean;
  //isOutputDirChosen: boolean;

  constructor() {
      console.log('Mode electron: Invoice Summary');
      console.log('Electron ipcRenderer: Invoice Summary', ipcRenderer);
      this.isFileChosen = false;
      this.isDirEmpty = true;
      this.isDirChosen = false;
      let model = this.model;
      ipcRenderer.on('pdfParse', function(event , data){
        console.log("Received msg from ipcmain");
        console.log(data);
        console.log(model.getShortPath(data,30));
        model.setPDFProgress(model.getShortPath(data,30));
      })
  };

  // private setInvListFile(file): void {
  //   this.invListFile = file;
  //   this.model.setSicomReportFile(file);
  // }

  private openFileDialog(): void {
    this.model.setInvFile(ipcRenderer.sendSync('open-file-dialog-for-file'));
    this.isFileChosen = true;
  }

  private remove(opt): void {
    if(opt == 'file') {
      this.model.setInvFile('');
      this.isFileChosen = false;
    } else if(opt == 'dir') {
      this.model.setInputDir('');
      this.isDirChosen = false;
      this.isDirEmpty = true;
    }
  }

  // private parseInvoiceInputFile(): string {
  //   let invFile = this.model.getSicomReportFile();
  //   return ipcRenderer.sendSync('parse-invoice-input',[invFile]);
  // };

  private generateGoogleFunct(): void {
    let invFile = this.model.getInvFile();
    let invs = ipcRenderer.sendSync('parse-invoice-input',[invFile]) + ";\n";
    let getFk = 'var url = new URL(this.document.location.href);\nvar fk = url.searchParams.get(\"_fk_\")' + ";\n"; //Need to parse this string still!@#$%^&^%$#@!@#$%^*#@@$!%^$%^$$!$@!!
    let googleFunct = "for(var i = 0; i < invs.length; i++) {\n" +
      "\twindow.open(\"https://sop.cscglobal.com/pbng/invoiceMatterSummaryReport.mm?INVOICEMATTERID=\"+invs[i]+\"&_fk_=\"+fk);\n" +
      "}";

    this.model.setGoogleFunct(invs + getFk + googleFunct);
    this.model.switchPage("setDirs");
  };

  private openDirDialog(dir): void {
    if(dir == 'input') {
      //this.model.setInputDir(ipcRenderer.sendSync('get-a-dir'));
      this.model.setInputDir("C:\\Users\\ssell\\Desktop\\BatchToolSuite\\input");
      this.isInputDirChosen = true;
    } /*else {
      this.model.setOutputDir(ipcRenderer.sendSync('get-a-dir'));
      this.model.setOutputDir("C:\\Users\\ssell\\Desktop\\BatchToolSuite\\output");
      this.isOutputDirChosen = true;
    }*/
    if(this.isInputDirChosen /*&& this.isOutputDirChosen*/) {
      this.isDirEmpty = ipcRenderer.sendSync('check-dir-empty',[this.model.getInputDir()]);
      this.isDirChosen = true;
    }
  }

  private submitDirs(): void {
    this.model.switchPage("googleFunct");
  }

  private copyGoogleFunct(): void {
    //Copy Google Funct to Clipboard
    this.isCopied = true;
    clipboard.writeText('test test text'); //this works
    //let browser = ipcRenderer.sendSync('open-chrome');
    /*if(browser) */this.pdfParsing();
  };

  private pdfParsing(): void {
    //Start PDF Listener
    let inputDir = this.model.getInputDir();//,
        //outputDir = this.model.getOutputDir();
    this.model.switchPage("pdfListener");
    let pdfs = ipcRenderer.sendSync('listen-for-pdfs',[inputDir/*,outputDir*/]);
    //if(pdfs || this.model.getPDFProgress()) this.model.setPDFProgress(pdfs);
  }

}
