import { Component } from '@angular/core';
import { SicomModel } from "./sicom.model";
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-sicom',
  templateUrl: './sicom.component.html',
  styleUrls: ['./sicom.component.css']
})
export class SicomComponent {

  model = new SicomModel();
  isFileChosen: boolean;

  constructor() {
      this.isFileChosen = false;
  };

  private openFileDialog(): void {
    this.model.setSicomReportFile(ipcRenderer.sendSync('open-file-dialog-for-file'));
    this.isFileChosen = true;
  }

  private remove(opt): void {
    if(opt == 'file') {
      this.model.setSicomReportFile('');
      this.isFileChosen = false;
    }
  }

  private processSicomReport(): void {
    let model = this.model;
    ipcRenderer.sendSync('build-csv',model.getSicomReportFile());
  }

}
