import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { MockInterceptor } from './interceptors/mock-interceptor';
import { RestStateAggregatorInterceptor } from './interceptors/rest-state-aggregator-interceptor';
import { CoreModule } from './modules/core.module';
import { PageModule } from './pages/pages.module';
import { CurrentLocaleService } from './services/locale/current-locale.service';
import { getICMBaseURL, getRestEndPoint, ICM_BASE_URL, REST_ENDPOINT } from './services/state-transfer/factories';
import { StatePropertiesService } from './services/state-transfer/state-properties.service';

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
    JsonpModule,
    AppRoutingModule,
    PageModule,
    CoreModule
  ],
  providers: [
    { provide: REST_ENDPOINT, useFactory: getRestEndPoint(), deps: [StatePropertiesService] },
    { provide: ICM_BASE_URL, useFactory: getICMBaseURL(), deps: [StatePropertiesService] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RestStateAggregatorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor( @Inject(PLATFORM_ID) platformId, translateService: TranslateService, currentLocaleService: CurrentLocaleService) {
    environment.platformId = platformId;

    const currentLang = environment.locales[0];
    translateService.setDefaultLang(currentLang.lang);
    currentLocaleService.setLang(currentLang);
  }
}
