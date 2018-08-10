// TODO: this is needed to set properties from environment to providers.
// In theory the platformBrowserDynamic method in main.ts could handle this but this breaks server-side rendering.
// tslint:disable: do-not-import-environment
import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // not used in production
import { TranslateService } from '@ngx-translate/core';
import { storeFreeze } from 'ngrx-store-freeze'; // not used in production

import { environment } from '../environments/environment';

import { AccountModule } from './account/account.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CheckoutModule } from './checkout/checkout.module';
import * as injectionKeys from './core/configurations/injection-keys';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { MockInterceptor } from './core/interceptors/mock.interceptor';
import {
  ICM_APPLICATION,
  ICM_BASE_URL,
  ICM_SERVER_URL,
  REST_ENDPOINT,
  getICMApplication,
  getICMBaseURL,
  getICMServerURL,
  getRestEndPoint,
} from './core/services/state-transfer/factories';
import { StatePropertiesService } from './core/services/state-transfer/state-properties.service';
import { coreEffects, coreReducers } from './core/store/core.system';
import { localStorageSyncReducer } from './core/store/local-storage-sync/local-storage-sync.reducer';
import { QuotingModule } from './quoting/quoting.module';
import { RegistrationModule } from './registration/registration.module';
import { FEATURE_TOGGLES } from './shared/feature-toggle/configurations/injection-keys';
import { ShoppingModule } from './shopping/shopping.module';

// tslint:disable-next-line: no-any
export const metaReducers: MetaReducer<any>[] = [
  ...(!environment.production ? [storeFreeze] : []),
  ...(environment.syncLocalStorage ? [localStorageSyncReducer] : []),
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'intershop-pwa',
    }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.serviceWorker }),
    HttpClientModule,
    BrowserTransferStateModule,
    CoreModule,
    // import the feature modules that provide the application functionalities
    ShoppingModule,
    CheckoutModule,
    RegistrationModule,
    AccountModule,
    QuotingModule,
    // AppRoutingModule needs to be imported last since it handles the '**' route that would otherwise overwrite any route that comes after it
    AppRoutingModule,
    StoreModule.forRoot(coreReducers, { metaReducers }),
    EffectsModule.forRoot(coreEffects),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    { provide: REST_ENDPOINT, useFactory: getRestEndPoint(), deps: [StatePropertiesService] },
    { provide: ICM_BASE_URL, useFactory: getICMBaseURL(), deps: [StatePropertiesService] },
    { provide: ICM_APPLICATION, useFactory: getICMApplication(), deps: [StatePropertiesService] },
    { provide: ICM_SERVER_URL, useFactory: getICMServerURL(), deps: [StatePropertiesService] },
    { provide: injectionKeys.NEED_MOCK, useValue: environment.needMock },
    // tslint:disable-next-line:no-string-literal
    { provide: injectionKeys.MUST_MOCK_PATHS, useValue: environment['mustMockPaths'] },
    {
      provide: injectionKeys.MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH,
      useValue: environment.mainNavigationMaxSubCategoriesDepth,
    },
    { provide: injectionKeys.ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: environment.endlessScrollingItemsPerPage },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
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
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(@Inject(LOCALE_ID) lang: string, translateService: TranslateService) {
    registerLocaleData(localeDe);
    registerLocaleData(localeFr);

    translateService.setDefaultLang(lang.replace(/\-/, '_'));
  }
}
