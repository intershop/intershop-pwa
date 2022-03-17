import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentMethodBaseModule } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-base.module';
import { FormlyModule } from '@ngx-formly/core';
import { CybersourcePaymentMethodConfigurationModule } from 'src/libs/checkout/payment/cybersource-payment-method-configuration/cybersource-payment-method-configuration.module';
import { DefaultPaymentMethodConfigurationModule } from 'src/libs/checkout/payment/default-payment-method-configuration/default-payment-method-configuration.module';
import { DemoPaymentMethodConfigurationModule } from 'src/libs/checkout/payment/demo-payment-method-configuration/demo-payment-method-configuration.module';

import { SharedModule } from 'ish-shared/shared.module';

import { CheckoutPaymentPageComponent } from './checkout-payment-page.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { serverValidationExtension } from './formly/server-validation.extension';
import { PaymentConcardisCreditcardCvcDetailComponent } from './payment-concardis-creditcard-cvc-detail/payment-concardis-creditcard-cvc-detail.component';
import { PaymentConcardisCreditcardComponent } from './payment-concardis-creditcard/payment-concardis-creditcard.component';
import { PaymentConcardisDirectdebitComponent } from './payment-concardis-directdebit/payment-concardis-directdebit.component';
import { PaymentConcardisComponent } from './payment-concardis/payment-concardis.component';
import { PaymentParameterFormComponent } from './payment-parameter-form/payment-parameter-form.component';
import { PaymentPayoneCreditcardComponent } from './payment-payone-creditcard/payment-payone-creditcard.component';

@NgModule({
  imports: [
    FormlyModule.forChild({
      extensions: [{ name: 'server-validation', extension: serverValidationExtension }],
    }),
    CybersourcePaymentMethodConfigurationModule,
    DefaultPaymentMethodConfigurationModule,
    DemoPaymentMethodConfigurationModule,
    PaymentMethodBaseModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [
    CheckoutPaymentComponent,
    CheckoutPaymentPageComponent,
    PaymentConcardisComponent,
    PaymentConcardisCreditcardComponent,
    PaymentConcardisCreditcardCvcDetailComponent,
    PaymentConcardisDirectdebitComponent,
    PaymentParameterFormComponent,
    PaymentPayoneCreditcardComponent,
  ],
})
export class CheckoutPaymentPageModule {
  static component = CheckoutPaymentPageComponent;
}
