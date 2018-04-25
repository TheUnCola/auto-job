import {Component, Inject} from '@angular/core';
import { SicomModel } from "./sicom.model";
import { ipcRenderer } from 'electron';
import {APP_CONFIG, AppConfig} from "../../config/app.config";
import {IAppConfig} from "../../config/iapp.config";

@Component({
  selector: 'app-sicom',
  templateUrl: './sicom.component.html',
  styleUrls: ['./sicom.component.css']
})
export class SicomComponent {

  model = new SicomModel();
  isFileChosen: boolean;
  isFileDone: boolean;
  backLink: string;

  constructor(@Inject(APP_CONFIG) appConfig: IAppConfig) {
      this.isFileChosen = false;
      this.isFileDone = false;
      this.backLink = AppConfig.routes.home;
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
    this.model.switchPage("processing");
    this.backLink = "/" + AppConfig.routes.sicom;
    let model = this.model;
    ipcRenderer.sendSync('build-csv',[model.getSicomReportFile()]);
    this.isFileDone = true;
  }

}
