import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RecaptchaLoaderService } from 'ng-recaptcha-2';

import { LazyCaptchaComponent } from './lazy-captcha/lazy-captcha.component';
import { SitekeyProviderService, getSynchronizedSiteKey } from './sitekey-provider/sitekey-provider.service';

@NgModule({
  imports: [CommonModule],
  declarations: [LazyCaptchaComponent],
  exports: [LazyCaptchaComponent],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useFactory: getSynchronizedSiteKey, deps: [SitekeyProviderService] },
    RecaptchaLoaderService,
    ReCaptchaV3Service,
    SitekeyProviderService,
  ],
})
export class CaptchaExportsModule {}
