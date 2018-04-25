export class SicomModel {

  private sicomReportFile: string;
  private currPage: string;

  constructor() {
    this.sicomReportFile = "";
    this.currPage = "fileUpload";
  }

  public setSicomReportFile(name): void {
    this.sicomReportFile = name;
  }

  public getSicomReportFile(): string {
    return this.sicomReportFile;
  }

  public getCurrPage(): string {
    return this.currPage;
  }

  public switchPage(page): void {
    this.currPage = page;
  }


  // Tool Functions
  public getShortPath(path,length): string {
    if(path.includes('/'))
      return path.split('/')[path.split('/').length - 1];
    else if(path.includes('\\'))
      return path.split('\\')[path.split('\\').length - 1];
    else if(path.length > length)
      return "..." + path.substring(path.length - length);
    else
      return path;
  }
}
