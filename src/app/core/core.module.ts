import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';
import { NgxCookieBannerModule } from 'ngx-cookie-banner';
import { SWIPER_CONFIG, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { ToastrModule } from 'ngx-toastr';
import { BrowserCookiesModule } from 'ngx-utils-cookies-port';

import { ConfigurationModule } from './configuration.module';
import { ExtrasModule } from './extras.module';
import { IconModule } from './icon.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MockInterceptor } from './interceptors/mock.interceptor';
import { StateManagementModule } from './state-management.module';

export function translateFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  keyboard: true,
  mousewheel: false,
  navigation: true,
  scrollbar: false,
};
@NgModule({
  imports: [
    BrowserCookiesModule.forRoot(),
    ConfigurationModule,
    ExtrasModule,
    FormlyModule.forRoot(),
    HttpClientModule,
    IconModule,
    NgxCookieBannerModule.forRoot({
      cookieName: 'cookieLawSeen',
    }),
    ReactiveComponentLoaderModule.forRoot(),
    RouterModule,
    StateManagementModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 3000,
      positionClass: 'toast-top-full-width', // toast-top-center
      preventDuplicates: true,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
    { provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG },
  ],
  // exports needed to use the cookie banner in the AppComponent
  exports: [NgxCookieBannerModule, TranslateModule],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    popoverConfig: NgbPopoverConfig
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }

    popoverConfig.placement = 'top';
    popoverConfig.triggers = 'hover';
    popoverConfig.container = 'body';
  }
}
