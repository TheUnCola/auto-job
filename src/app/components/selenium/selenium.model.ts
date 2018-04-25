export class SeleniumModel {

  private processes: string[];
  private currProcess: string;

  constructor() {
    this.processes = [];
    this.currProcess = "";
  }

  public setProcesses(processes): void {
    this.processes = processes;
  }

  public getProcesses(): string[] {
    return this.processes;
  }

  public setCurrProcess(process): void {
    this.currProcess = process;
  }

  public getCurrProcess(): string {
    return this.currProcess;
  }

  public formatUpper(string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
