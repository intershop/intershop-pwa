import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyCaptchaComponent } from './lazy-captcha/lazy-captcha.component';
import { SitekeyProviderService } from './sitekey-provider/sitekey-provider.service';

@NgModule({
  imports: [CommonModule],
  declarations: [LazyCaptchaComponent],
  providers: [SitekeyProviderService],
  exports: [LazyCaptchaComponent],
})
export class CaptchaExportsModule {}
