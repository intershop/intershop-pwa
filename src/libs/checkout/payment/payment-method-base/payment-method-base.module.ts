import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedUiFormlyModule } from '@intershop-pwa/formly/shared-ui-formly.module';
import { FormlyModule } from '@ngx-formly/core';

import { PaymentMethodWrapperComponent } from './formly/payment-method-wrapper/payment-method-wrapper.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      wrappers: [
        {
          name: 'ish-payment-method-wrapper',
          component: PaymentMethodWrapperComponent,
        },
      ],
    }),
    CommonModule,
    SharedUiFormlyModule,
  ],
  declarations: [PaymentMethodWrapperComponent],
})
export class PaymentMethodBaseModule {}
