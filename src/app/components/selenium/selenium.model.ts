export class SeleniumModel {

  private invFile: string;
  private inputDir: string;
  //private outputDir: string;
  private googleFunct: string;
  /*private pages: {
    fileUpload:boolean,
    googleFunct:boolean
  };*/
  private currPage: string;
  private pdfProgress: string;

  constructor() {
    this.invFile = "";
    this.inputDir = "";
    //this.outputDir = "";
    this.googleFunct = "";
    //this.pages.fileUpload = true;
    this.currPage = "fileUpload";
    this.pdfProgress = "";
  }

  public setInvFile(name): void {
    this.invFile = name;
  }

  public getInvFile(): string {
    return this.invFile;
  }

  public setInputDir(dir): void {
    this.inputDir = dir;
  }

  public getInputDir(): string {
    return this.inputDir;
  }

  /*public setOutputDir(dir): void {
    this.outputDir = dir;
  }

  public getOutputDir(): string {
    return this.outputDir;
  }*/

  public setGoogleFunct(funct): void {
    this.googleFunct = funct;
  }

  public getGoogleFunct(): string {
    return this.googleFunct;
  }

  /*public getPage(pageName): string {
    return this.pages[pageName];
  }*/

  public getCurrPage(): string {
    return this.currPage;
  }

  public switchPage(page): void {
    this.currPage = page;
  }

  public setPDFProgress(progress): void {
    this.pdfProgress += progress;
  }

  public getPDFProgress(): string {
    return this.pdfProgress;
  }

  public clearPDFProgress(): void {
    this.pdfProgress = "";
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
