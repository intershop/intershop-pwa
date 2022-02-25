import { NgModule } from '@angular/core';
import { FIELD_LIBRARY_CONFIGURATION } from '@intershop-pwa/formly/field-library/services/field-library/field-library.service';
import { SharedUiFormlyModule } from '@intershop-pwa/formly/shared-ui-formly.module';
import { FormlyModule as FormlyBaseModule } from '@ngx-formly/core';
import { CaptchaExportsModule } from 'src/app/extensions/captcha/exports/captcha-exports.module';

import { CaptchaFieldComponent } from './captcha-field/captcha-field.component';
import { TitleConfiguration } from './title.configuration';

@NgModule({
  declarations: [CaptchaFieldComponent],
  imports: [
    CaptchaExportsModule,
    FormlyBaseModule.forChild({
      types: [{ name: 'ish-captcha-field', component: CaptchaFieldComponent }],
    }),
    SharedUiFormlyModule,
  ],
  providers: [{ provide: FIELD_LIBRARY_CONFIGURATION, useClass: TitleConfiguration, multi: true }],
  exports: [SharedUiFormlyModule],
})
export class FormlyModule {}
