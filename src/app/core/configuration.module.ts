import { NgModule } from '@angular/core';

import { environment } from '../../environments/environment';

import * as injectionKeys from './configurations/injection-keys';

@NgModule({
  providers: [
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
    { provide: injectionKeys.USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' },
    { provide: injectionKeys.SMALL_BREAKPOINT_WIDTH, useValue: environment.smallBreakpointWidth },
    { provide: injectionKeys.MEDIUM_BREAKPOINT_WIDTH, useValue: environment.mediumBreakpointWidth },
    { provide: injectionKeys.LARGE_BREAKPOINT_WIDTH, useValue: environment.largeBreakpointWidth },
    { provide: injectionKeys.EXTRALARGE_BREAKPOINT_WIDTH, useValue: environment.extralargeBreakpointWidth },
    { provide: injectionKeys.THEME, useValue: environment.theme },
  ],
})
export class ConfigurationModule {}
