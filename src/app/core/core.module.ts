import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

import { FeatureToggleModule } from '../shared/feature-toggle.module';

import { FooterModule } from './footer.module';
import { HeaderModule } from './header.module';
import { IconModule } from './icon.module';
import { CrosstabService } from './services/crosstab/crosstab.service';

export function translateFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
@NgModule({
  imports: [
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
    FeatureToggleModule.forRoot(),
  ],
  exports: [HeaderModule, FooterModule],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
    popoverConfig: NgbPopoverConfig,
    crosstabService: CrosstabService
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
    popoverConfig.placement = 'top';
    popoverConfig.triggers = 'hover';
    popoverConfig.container = 'body';

    crosstabService.listen();

    IconModule.init();
  }
}
