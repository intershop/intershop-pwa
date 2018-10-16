import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NgbCarouselModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPopoverConfig,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RecaptchaModule } from 'ng-recaptcha/recaptcha/recaptcha.module';

import { ConfigurationModule } from './configuration.module';
import { FooterModule } from './footer.module';
import { HeaderModule } from './header.module';
import { IconModule } from './icon.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MockInterceptor } from './interceptors/mock.interceptor';
import { StateManagementModule } from './state-management.module';

export function translateFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [HttpClient],
      },
    }),
    RecaptchaModule.forRoot(),
    NgbDropdownModule,
    NgbCarouselModule,
    NgbCollapseModule,
    NgbModalModule,
    NgbPopoverModule,
    HeaderModule,
    IconModule,
    FooterModule,
    StateManagementModule,
    ConfigurationModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
  ],
  exports: [HeaderModule, FooterModule],
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

    IconModule.init();
  }
}
