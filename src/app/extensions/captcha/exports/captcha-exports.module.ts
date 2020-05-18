import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SitekeyProviderService } from '../services/sitekey-provider/sitekey-provider.service';

import { LazyCaptchaComponent } from './captcha/lazy-captcha/lazy-captcha.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LazyCaptchaComponent],
  exports: [LazyCaptchaComponent],
  providers: [SitekeyProviderService],
})
export class CaptchaExportsModule {}
