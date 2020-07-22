import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCookieBannerModule } from 'ngx-cookie-banner';
import { BrowserCookiesModule } from 'ngx-utils-cookies-port';

import { environment } from '../../environments/environment';

import { AppearanceModule } from './appearance.module';
import { ConfigurationModule } from './configuration.module';
import { ExtrasModule } from './extras.module';
import { FeatureToggleModule } from './feature-toggle.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MockInterceptor } from './interceptors/mock.interceptor';
import { InternationalizationModule } from './internationalization.module';
import { StateManagementModule } from './state-management.module';
import { DefaultErrorhandler } from './utils/default-error-handler';
import { ModuleLoaderService } from './utils/module-loader/module-loader.service';

@NgModule({
  imports: [
    AppearanceModule,
    BrowserCookiesModule.forRoot(),
    ConfigurationModule,
    ExtrasModule,
    FeatureToggleModule,
    FormlyModule.forRoot(),
    HttpClientModule,
    InternationalizationModule,
    NgxCookieBannerModule.forRoot({
      cookieName: 'cookieLawSeen',
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.serviceWorker }),
    StateManagementModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
    { provide: ErrorHandler, useClass: DefaultErrorhandler },
  ],
  // exports needed to use the cookie banner in the AppComponent
  exports: [NgxCookieBannerModule, TranslateModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule, moduleLoader: ModuleLoaderService) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
    moduleLoader.init();
  }
}
