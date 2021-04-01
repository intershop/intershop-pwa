import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyCaptchaComponent } from './lazy-captcha/lazy-captcha.component';
import { SitekeyProviderService } from './sitekey-provider/sitekey-provider.service';

@NgModule({
  imports: [CommonModule],
  declarations: [LazyCaptchaComponent],
  exports: [LazyCaptchaComponent],
  providers: [SitekeyProviderService],
})
export class CaptchaExportsModule {}
