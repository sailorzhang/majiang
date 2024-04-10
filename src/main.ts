import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import {
  devuiLightTheme,
  ThemeServiceInit
} from 'ng-devui/theme';

import { infinityTheme } from 'ng-devui/theme-collection';

ThemeServiceInit({
  'devui-light-theme': devuiLightTheme,
  'infinity-theme': infinityTheme,
}, 'infinity-theme');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
