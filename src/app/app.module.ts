import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { CookieModule } from 'ngx-cookie';
import { AccountRoutingModule } from './account/account-routing.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MUST_MOCK_PATHS, NEED_MOCK } from './core/configurations/injection-keys';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { RestStateAggregatorInterceptor } from './core/interceptors/rest-state-aggregator.interceptor';
import { CurrentLocaleService } from './core/services/locale/current-locale.service';
import { getICMBaseURL, getRestEndPoint, ICM_BASE_URL, REST_ENDPOINT } from './core/services/state-transfer/factories';
import { StatePropertiesService } from './core/services/state-transfer/state-properties.service';
import { MockInterceptor } from './mocking/interceptors/mock.interceptor';
import { RegistrationRoutingModule } from './registration/registration-routing.module';
import { ShellModule } from './shell/shell.module';
import { ShoppingRoutingModule } from './shopping/shopping-routing.module';

// tslint:disable-next-line: do-not-import-environment
import { environment } from '../environments/environment';

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
    CookieModule.forRoot(),
    CoreModule,
    ShellModule,
    ShoppingRoutingModule,
    RegistrationRoutingModule,
    AccountRoutingModule,
    // AppRoutingModule needs to be imported last since it handles the '**' route that would otherwise overwrite any route that comes after it
    AppRoutingModule
  ],
  providers: [
    { provide: REST_ENDPOINT, useFactory: getRestEndPoint(), deps: [StatePropertiesService] },
    { provide: ICM_BASE_URL, useFactory: getICMBaseURL(), deps: [StatePropertiesService] },
    { provide: NEED_MOCK, useValue: environment.needMock },
    { provide: MUST_MOCK_PATHS, useValue: environment['mustMockPaths'] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RestStateAggregatorInterceptor, multi: true },
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule {

  constructor(
    translateService: TranslateService,
    currentLocaleService: CurrentLocaleService
  ) {
    const currentLang = environment.locales[0];
    translateService.setDefaultLang(currentLang.lang);
    currentLocaleService.setValue(currentLang);
  }
}
