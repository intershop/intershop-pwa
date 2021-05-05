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
  mandateCreatedDateTime: number;

  /**
   * Show SEPA mandate information
   */
  showSepaMandateText() {
    this.mandateReference = this.paymentInstrument.parameters
      .find(param => param.name === 'mandateReference')
      .value.toString();
    this.mandateText = this.paymentInstrument.parameters.find(param => param.name === 'mandateText').value.toString();
    const mandateCreatedDateTimeStr = this.paymentInstrument.parameters
      .find(param => param.name === 'mandateCreatedDateTime')
      .value.toString();
    this.mandateCreatedDateTime = Number(mandateCreatedDateTimeStr) || 0;
  }
}
