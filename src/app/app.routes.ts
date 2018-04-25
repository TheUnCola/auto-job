import { Routes } from '@angular/router';
import { HomeComponent } from './components/home';
import { NoContentComponent } from './core/no-content';
import { AppConfig } from './config/app.config';
import { SeleniumComponent } from './components/selenium';
import { SicomComponent } from './components/sicom';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: AppConfig.routes.selenium, component: SeleniumComponent },
  { path: AppConfig.routes.sicom, component: SicomComponent },
  { path: '**',    component: NoContentComponent },
];
