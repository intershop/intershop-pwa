import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';

@Component({
  selector: 'ish-account-payment',
  templateUrl: './account-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPaymentComponent {
  @Input() paymentMethods: PaymentMethod[];
  @Input() error: HttpError;

  @Output() deletePaymentInstrument = new EventEmitter<string>();

  /**
   * deletes a basket instrument and related payment
   */
  deleteUserPayment(paymentInstrumentId: string) {
    if (paymentInstrumentId) {
      this.deletePaymentInstrument.emit(paymentInstrumentId);
    }
  }
}
