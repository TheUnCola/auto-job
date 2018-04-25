import { Component, Inject } from '@angular/core';

import {APP_CONFIG, AppConfig} from '../../config/app.config';
import {IAppConfig} from '../../config/iapp.config';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  appConfig: any;
  // menuItems: any[];

  constructor(@Inject(APP_CONFIG) appConfig: IAppConfig) {
    this.appConfig = appConfig;
    // this.loadMenus();
  }

  // private loadMenus(): void {
  //   this.menuItems = [
  //     {link: '/' + AppConfig.routes.selenium, name: 'Invoice Summary'},
  //     {link: '/' + AppConfig.routes.selenium, name: 'PDF Splitter'}
  //   ];
  // }

}
