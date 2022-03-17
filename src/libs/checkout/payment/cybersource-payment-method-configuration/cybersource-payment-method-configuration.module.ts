import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentMethodBaseModule } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-base.module';
import { PAYMENT_METHOD } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method.interface';
import { IconModule } from '@intershop-pwa/icon/icon.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentCybersourceCreditcardComponent } from 'src/app/pages/checkout-payment/payment-cybersource-creditcard/payment-cybersource-creditcard.component';

import { CybersourceCreditCardPaymentMethodConfiguration } from './cybersource-credit-card-payment-method-configuration';
import { CybersourceParamsFieldComponent } from './formly/cybersource-params-field';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    NgbPopoverModule,
    PaymentMethodBaseModule,
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
