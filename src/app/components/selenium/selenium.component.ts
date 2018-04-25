import { Component } from '@angular/core';
import { SeleniumModel } from "./selenium.model";
import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-selenium',
  templateUrl: './selenium.component.html',
  styleUrls: ['./selenium.component.css']
})
export class SeleniumComponent {

  model = new SeleniumModel();
  showProcessList: boolean;

  constructor() {
    this.getProcessList();
    this.showProcessList = true;
  };

  private chooseProcess(process): void {
    this.showProcessList = false;
    this.model.setCurrProcess(process);
    ipcRenderer.send('do-process',[process]);
  }

  private getProcessList(): void {
    this.model.setProcesses(ipcRenderer.sendSync('get-process-list'));
  }
}
