import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LazyCaptchaComponent } from './lazy-captcha/lazy-captcha.component';
import { SitekeyProviderService } from './sitekey-provider/sitekey-provider.service';

@NgModule({
  declarations: [LazyCaptchaComponent],
  imports: [CommonModule],
  exports: [LazyCaptchaComponent],
  providers: [SitekeyProviderService],
})
export class CaptchaExportsModule {}
