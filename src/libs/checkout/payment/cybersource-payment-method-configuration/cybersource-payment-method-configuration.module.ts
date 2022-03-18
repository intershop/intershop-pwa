import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentMethodBaseModule } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-base.module';
import { PAYMENT_METHOD } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';
import { IconModule } from '@intershop-pwa/icon/icon.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { CybersourceCreditCardPaymentMethodConfiguration } from './cybersource-credit-card-payment-method-configuration';
import { CybersourceParamsFieldComponent } from './formly/cybersource-params-field';
import { PaymentCybersourceCreditcardComponent } from './payment-cybersource-creditcard/payment-cybersource-creditcard.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    NgbPopoverModule,
    PaymentMethodBaseModule,
    ReactiveFormsModule,
    TranslateModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'cybersource-params',
          component: CybersourceParamsFieldComponent,
        },
      ],
    }),
  ],
  declarations: [CybersourceParamsFieldComponent, PaymentCybersourceCreditcardComponent],
  providers: [{ provide: PAYMENT_METHOD, useClass: CybersourceCreditCardPaymentMethodConfiguration, multi: true }],
})
export class CybersourcePaymentMethodConfigurationModule {}
