import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // not used in production
import { storeFreeze } from 'ngrx-store-freeze'; // not used in production
import { AccountModule } from './account/account.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AVAILABLE_LOCALES, MUST_MOCK_PATHS, NEED_MOCK, USER_REGISTRATION_LOGIN_TYPE, USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER } from './core/configurations/injection-keys';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { MockInterceptor } from './core/interceptors/mock.interceptor';
import { RestStateAggregatorInterceptor } from './core/interceptors/rest-state-aggregator.interceptor';
import { getICMApplication, getICMBaseURL, getICMServerURL, getRestEndPoint, ICM_APPLICATION, ICM_BASE_URL, ICM_SERVER_URL, REST_ENDPOINT } from './core/services/state-transfer/factories';
import { StatePropertiesService } from './core/services/state-transfer/state-properties.service';
import { CustomSerializer, effects, reducers } from './core/store/core.system';
import { RegistrationModule } from './registration/registration.module';
import { ShoppingModule } from './shopping/shopping.module';

// TODO: this is needed to set properties from environment to providers.
// In theory the platformBrowserDynamic method in main.ts could handle this but this breaks server-side rendering.
// tslint:disable-next-line: do-not-import-environment
import { environment } from '../environments/environment';

export const metaReducers: MetaReducer<any>[] = !environment.production ? [storeFreeze] : [];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({
      appId: 'proof-of-concept'
    }),
    HttpClientModule,
    BrowserTransferStateModule,
    CoreModule,
    // import the feature modules that provide the application functionalities
    ShoppingModule,
    RegistrationModule,
    AccountModule,
    // AppRoutingModule needs to be imported last since it handles the '**' route that would otherwise overwrite any route that comes after it
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    { provide: REST_ENDPOINT, useFactory: getRestEndPoint(), deps: [StatePropertiesService] },
    { provide: ICM_BASE_URL, useFactory: getICMBaseURL(), deps: [StatePropertiesService] },
    { provide: ICM_APPLICATION, useFactory: getICMApplication(), deps: [StatePropertiesService] },
    { provide: ICM_SERVER_URL, useFactory: getICMServerURL(), deps: [StatePropertiesService] },
    { provide: NEED_MOCK, useValue: environment.needMock },
    { provide: MUST_MOCK_PATHS, useValue: environment['mustMockPaths'] },
    { provide: AVAILABLE_LOCALES, useValue: environment.locales },
    // TODO: get from REST call
    { provide: USER_REGISTRATION_LOGIN_TYPE, useValue: 'email' },
    // TODO: get from REST call
    { provide: USER_REGISTRATION_SUBSCRIBE_TO_NEWSLETTER, useValue: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RestStateAggregatorInterceptor, multi: true },
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule {

  constructor() { }
}
