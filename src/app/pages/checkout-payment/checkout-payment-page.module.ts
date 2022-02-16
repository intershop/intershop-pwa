import { NgModule } from '@angular/core';
import { FormlyModule } from '@ngx-formly/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutPaymentPageComponent } from './checkout-payment-page.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { PaymentSaveCheckboxComponent } from './formly/payment-save-checkbox/payment-save-checkbox.component';
import { serverValidationExtension } from './formly/server-validation.extension';
import { PaymentConcardisCreditcardCvcDetailComponent } from './payment-concardis-creditcard-cvc-detail/payment-concardis-creditcard-cvc-detail.component';
import { PaymentConcardisCreditcardComponent } from './payment-concardis-creditcard/payment-concardis-creditcard.component';
import { PaymentConcardisDirectdebitComponent } from './payment-concardis-directdebit/payment-concardis-directdebit.component';
import { PaymentConcardisComponent } from './payment-concardis/payment-concardis.component';
import { PaymentCybersourceCreditcardComponent } from './payment-cybersource-creditcard/payment-cybersource-creditcard.component';
import { PaymentParameterFormComponent } from './payment-parameter-form/payment-parameter-form.component';
import { PaymentPayoneCreditcardComponent } from './payment-payone-creditcard/payment-payone-creditcard.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      extensions: [{ name: 'server-validation', extension: serverValidationExtension }],
    }),
    SharedModule,
  ],
  declarations: [
    CheckoutPaymentComponent,
    CheckoutPaymentPageComponent,
    PaymentConcardisComponent,
    PaymentConcardisCreditcardComponent,
    PaymentConcardisCreditcardCvcDetailComponent,
    PaymentConcardisDirectdebitComponent,
    PaymentCybersourceCreditcardComponent,
    PaymentParameterFormComponent,
    PaymentPayoneCreditcardComponent,
    PaymentSaveCheckboxComponent,
  ],
})
export class CheckoutPaymentPageModule {
  static component = CheckoutPaymentPageComponent;
}
