import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedUiFormlyModule } from '@intershop-pwa/formly/shared-ui-formly.module';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { PaymentInstrumentsDeleteWrapperComponent } from './formly/payment-instruments-delete-wrapper/payment-instruments-delete-wrapper.component';
import { PaymentMethodWrapperComponent } from './formly/payment-method-wrapper/payment-method-wrapper.component';
import { PaymentParametersTypeComponent } from './formly/payment-parameters-type/payment-parameters-type.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [{ name: 'ish-payment-parameters-type', component: PaymentParametersTypeComponent }],
      wrappers: [
        {
          name: 'ish-payment-method-wrapper',
          component: PaymentMethodWrapperComponent,
        },
        {
          name: 'ish-payment-instruments-delete-wrapper',
          component: PaymentInstrumentsDeleteWrapperComponent,
        },
      ],
    }),
    CommonModule,
    SharedUiFormlyModule,
    TranslateModule,
  ],
  declarations: [
    PaymentInstrumentsDeleteWrapperComponent,
    PaymentMethodWrapperComponent,
    PaymentParametersTypeComponent,
  ],
})
export class PaymentMethodBaseModule {}
