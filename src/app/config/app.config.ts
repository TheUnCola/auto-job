import {InjectionToken} from '@angular/core';

import {IAppConfig} from './iapp.config';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: IAppConfig = {
  routes: {
    selenium: 'selenium',
    sicom: 'sicom',
    home: '',
    error404: '404'
  }
};
