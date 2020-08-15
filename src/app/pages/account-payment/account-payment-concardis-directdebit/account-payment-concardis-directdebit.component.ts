import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';

@Component({
  selector: 'ish-account-payment-concardis-directdebit',
  templateUrl: './account-payment-concardis-directdebit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPaymentConcardisDirectdebitComponent {
  @Input() paymentInstrument: PaymentInstrument;

  mandateReference: string;
  mandateText: string;
  mandateCreatedDateTime: string;

  /**
   * Show SEPA mandate information
   */
  showSepaMandateText(paymentInstrument: PaymentInstrument) {
    this.mandateReference = paymentInstrument.parameters
      .find(param => param.name === 'mandateReference')
      .value.toString();
    this.mandateText = paymentInstrument.parameters.find(param => param.name === 'mandateText').value.toString();
    this.mandateCreatedDateTime = paymentInstrument.parameters
      .find(param => param.name === 'mandateCreatedDateTime')
      .value.toString();
  }
}
