import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserCookiesModule } from 'ngx-utils-cookies-port';

import { environment } from '../../environments/environment';

import { AppearanceModule } from './appearance.module';
import { ConfigurationModule } from './configuration.module';
import { ExtrasModule } from './extras.module';
import { FeatureToggleModule } from './feature-toggle.module';
import { IdentityProviderModule } from './identity-provider.module';
import { ICMErrorMapperInterceptor } from './interceptors/icm-error-mapper.interceptor';
import { IdentityProviderInterceptor } from './interceptors/identity-provider.interceptor';
import { MockInterceptor } from './interceptors/mock.interceptor';
import { InternationalizationModule } from './internationalization.module';
import { StateManagementModule } from './state-management.module';
import { DefaultErrorhandler } from './utils/default-error-handler';

@NgModule({
  imports: [
    AppearanceModule,
    BrowserCookiesModule.forRoot(),
    ConfigurationModule,
    ExtrasModule,
    FeatureToggleModule,
    HttpClientModule,
    IdentityProviderModule,
    InternationalizationModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.serviceWorker }),
    StateManagementModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ICMErrorMapperInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: IdentityProviderInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
    { provide: ErrorHandler, useClass: DefaultErrorhandler },
    {
      provide: APP_BASE_HREF,
      useFactory: (s: PlatformLocation, baseHref: string) => baseHref || s.getBaseHrefFromDOM(),
      deps: [PlatformLocation, [new Optional(), new SkipSelf(), APP_BASE_HREF]],
    },
  ],
  // exports needed to use the cookie banner in the AppComponent
  exports: [TranslateModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
