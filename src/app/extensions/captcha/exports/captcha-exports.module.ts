import { NgModule } from '@angular/core';

import { LazyCaptchaComponent } from './lazy-captcha/lazy-captcha.component';
import { SitekeyProviderService } from './sitekey-provider/sitekey-provider.service';

@NgModule({
  imports: [LazyCaptchaComponent],
  exports: [LazyCaptchaComponent],
  providers: [SitekeyProviderService],
})
export class CaptchaExportsModule {}
