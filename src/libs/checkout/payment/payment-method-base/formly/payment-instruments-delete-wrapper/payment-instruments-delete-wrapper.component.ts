import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { PaymentMethodFacade } from '@intershop-pwa/checkout/payment/payment-method-base/payment-method-facade/payment-method.facade';
import { FieldWrapper } from '@ngx-formly/core';

// eslint-disable-next-line ish-custom-rules/require-formly-code-documentation
@Component({
  selector: 'ish-payment-instruments-delete-wrapper',
  templateUrl: './payment-instruments-delete-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentInstrumentsDeleteWrapperComponent extends FieldWrapper {
  constructor(private paymentMethodFacade: PaymentMethodFacade) {
    super();
  }

  deletePaymentInstrument(paymentInstrument: PaymentInstrument) {
    this.paymentMethodFacade.deletePaymentInstrument(paymentInstrument);
  }
}
