import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaymentInstrument } from '@intershop-pwa/checkout/payment/payment-method-base/models/payment-instrument.model';
import { FieldWrapper } from '@ngx-formly/core';

// eslint-disable-next-line ish-custom-rules/require-formly-code-documentation
@Component({
  selector: 'ish-payment-instruments-delete-wrapper',
  templateUrl: './payment-instruments-delete-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentInstrumentsDeleteWrapperComponent extends FieldWrapper {
  get deletePaymentInstrumentCallback(): (paymentInstrument: PaymentInstrument) => void {
    return this.to.deletePaymentInstrumentCallback;
  }
}
