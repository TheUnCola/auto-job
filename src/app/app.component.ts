/*
 * Angular 2 decorators and services
 */
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { shell } from 'electron';
import { AppState } from './reducers';
import { Store } from '@ngrx/store';
import { HomeState } from './components/home/home.reducer';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  // public angularclassLogo = 'assets/img/csc.png';
  // public name = 'AutoPilot';
  // public url = 'https://cscgithub.cscglobal.com/ssell/batch-tool-suite';
  public state$: Observable<HomeState>;

  constructor(private store: Store<AppState>) {
    this.state$ = this.store.select(state => state.home);
  }

  public ngOnInit() {
    this.state$.take(1)
      .subscribe(state => {
        console.log('Initial App State', state);
      });
  }

  public openURL(url) {
    shell.openExternal(url);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
