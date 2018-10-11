import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

import { FeatureToggleModule } from '../shared/feature-toggle.module';
import { FEATURE_TOGGLES } from '../shared/feature-toggle/configurations/injection-keys';

import * as injectionKeys from './configurations/injection-keys';

@NgModule({
  imports: [FeatureToggleModule.forRoot()],
  providers: [
    { provide: injectionKeys.NEED_MOCK, useValue: environment.needMock },
    // tslint:disable-next-line:no-string-literal
    { provide: injectionKeys.MUST_MOCK_PATHS, useValue: environment['mustMockPaths'] },
    {
      provide: injectionKeys.MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH,
      useValue: environment.mainNavigationMaxSubCategoriesDepth,
    },
    { provide: injectionKeys.ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: environment.endlessScrollingItemsPerPage },
    // TODO: get from REST call
    { provide: injectionKeys.AVAILABLE_LOCALES, useValue: environment.locales },
    { provide: injectionKeys.USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' },
    // tslint:disable-next-line:no-string-literal
    { provide: FEATURE_TOGGLES, useValue: environment['features'] },
    { provide: injectionKeys.SMALL_BREAKPOINT_WIDTH, useValue: environment.smallBreakpointWidth },
    { provide: injectionKeys.MEDIUM_BREAKPOINT_WIDTH, useValue: environment.mediumBreakpointWidth },
    { provide: injectionKeys.LARGE_BREAKPOINT_WIDTH, useValue: environment.largeBreakpointWidth },
    { provide: injectionKeys.EXTRALARGE_BREAKPOINT_WIDTH, useValue: environment.extralargeBreakpointWidth },
  ],
})
export class ConfigurationModule {
  constructor(@Inject(LOCALE_ID) lang: string, translateService: TranslateService) {
    registerLocaleData(localeDe);
    registerLocaleData(localeFr);

    translateService.setDefaultLang(lang.replace(/\-/, '_'));
  }
}
