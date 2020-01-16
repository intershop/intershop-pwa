import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

import { environment } from '../../environments/environment';

import * as injectionKeys from './configurations/injection-keys';
import { FeatureToggleModule } from './feature-toggle.module';
import { ThemeService } from './utils/theme/theme.service';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    // tslint:disable-next-line:no-string-literal
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment['captchaSiteKey'] },
    // tslint:disable-next-line:no-string-literal
    { provide: injectionKeys.MOCK_SERVER_API, useValue: environment['mockServerAPI'] },
    // tslint:disable-next-line:no-string-literal
    { provide: injectionKeys.MUST_MOCK_PATHS, useValue: environment['mustMockPaths'] },
    {
      provide: injectionKeys.MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH,
      useValue: environment.mainNavigationMaxSubCategoriesDepth,
    },
    { provide: injectionKeys.PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: environment.productListingItemsPerPage },
    { provide: injectionKeys.DEFAULT_PRODUCT_LISTING_VIEW_TYPE, useValue: environment.defaultProductListingViewType },
    // TODO: get from REST call
    { provide: injectionKeys.AVAILABLE_LOCALES, useValue: environment.locales },
    { provide: injectionKeys.USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' },
    // tslint:disable-next-line:no-string-literal
    { provide: injectionKeys.CAPTCHA_SITE_KEY, useValue: environment['captchaSiteKey'] },
    { provide: injectionKeys.SMALL_BREAKPOINT_WIDTH, useValue: environment.smallBreakpointWidth },
    { provide: injectionKeys.MEDIUM_BREAKPOINT_WIDTH, useValue: environment.mediumBreakpointWidth },
    { provide: injectionKeys.LARGE_BREAKPOINT_WIDTH, useValue: environment.largeBreakpointWidth },
    { provide: injectionKeys.EXTRALARGE_BREAKPOINT_WIDTH, useValue: environment.extralargeBreakpointWidth },
    { provide: injectionKeys.THEME, useValue: environment.theme },
  ],
})
export class ConfigurationModule {
  constructor(@Inject(LOCALE_ID) lang: string, translateService: TranslateService, themeService: ThemeService) {
    themeService.init();
    registerLocaleData(localeDe);
    registerLocaleData(localeFr);

    translateService.setDefaultLang(lang.replace(/\-/, '_'));
  }
}
