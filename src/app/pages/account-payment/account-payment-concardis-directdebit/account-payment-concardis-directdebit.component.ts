
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { DatePipe } from 'ish-core/pipes/date.pipe';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

@Component({
  selector: 'ish-account-payment-concardis-directdebit',
  templateUrl: './account-payment-concardis-directdebit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DatePipe, ModalDialogLinkComponent, TranslatePipe],
})
export class AccountPaymentConcardisDirectdebitComponent {
  @Input({ required: true }) paymentInstrument: PaymentInstrument;

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
