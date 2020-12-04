import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { SpaCheckoutPaymentPageComponent } from './spa-checkout-payment-page.component';
import { SpaCheckoutPaymentComponent } from './spa-checkout-payment/spa-checkout-payment.component';
import { SpaPaymentConcardisCreditcardCvcDetailComponent } from './spa-payment-concardis-creditcard-cvc-detail/spa-payment-concardis-creditcard-cvc-detail.component';
import { SpaPaymentConcardisCreditcardComponent } from './spa-payment-concardis-creditcard/spa-payment-concardis-creditcard.component';
import { SpaPaymentConcardisDirectdebitComponent } from './spa-payment-concardis-directdebit/spa-payment-concardis-directdebit.component';
import { SpaPaymentConcardisComponent } from './spa-payment-concardis/spa-payment-concardis.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    SpaCheckoutPaymentComponent,
    SpaCheckoutPaymentPageComponent,
    SpaPaymentConcardisComponent,
    SpaPaymentConcardisCreditcardComponent,
    SpaPaymentConcardisCreditcardCvcDetailComponent,
    SpaPaymentConcardisDirectdebitComponent,
  ],
  exports: [SpaCheckoutPaymentPageComponent],
})
export class SpaCheckoutPaymentPageModule {}
