import {Component, OnInit} from '@angular/core';
//import { ipcRenderer } from 'electron';
import { AppConfig } from '../../config/app.config';

// import { Store } from '@ngrx/store';
// import { AppState } from '../reducers';
// import { HomeState } from './home.reducer';
import * as home from './home.actions';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  // providers: [
  //   Title
  // ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent /*implements OnInit*/ {

  items: any[];

  constructor() {
    this.loadProcesses();
  }

  private loadProcesses(): void {
    this.items = [
      {name: 'Selenium', link: AppConfig.routes.selenium},
      {name: 'Sicom', link: AppConfig.routes.sicom}
    ];
  }
}
