import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';

/**
 * The Account Payment Component displays the preferred payment instrument of the user
 * and any further payment instruments. The user can delete payment instruments and change the preferred payment instrument.
 * Adding a payment instrument is only possible during the checkout.
 * see also: {@link AccountPaymentPageComponent}
 */
@Component({
  selector: 'ish-account-payment',
  templateUrl: './account-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPaymentComponent implements OnChanges {
  @Input() paymentMethods: PaymentMethod[];
  @Input() user: User;
  @Input() error: HttpError;

  @Output() deletePaymentInstrument = new EventEmitter<string>();
  @Output() updateDefaultPaymentInstrument = new EventEmitter<User>();

  preferredPaymentInstrument: PaymentInstrument;
  preferredPaymentMethod: PaymentMethod;
  savedPaymentMethods: PaymentMethod[];

  /**
   * refresh the display of the preferred payment instrument and the shown further addresses.
   */
  ngOnChanges() {
    this.determinePreferredPaymentInstrument();
    this.determineFurtherPaymentMethods();
  }

  determineFurtherPaymentMethods() {
    this.savedPaymentMethods = this.paymentMethods;
    if (this.preferredPaymentInstrument) {
      this.savedPaymentMethods = this.savedPaymentMethods
        .map(pm => ({
          ...pm,
          paymentInstruments: pm.paymentInstruments.filter(pi => pi.id !== this.preferredPaymentInstrument.id),
        }))
        .filter(pm => pm.paymentInstruments && pm.paymentInstruments.length);
    }
  }

  determinePreferredPaymentInstrument() {
    this.preferredPaymentInstrument = undefined;
    this.preferredPaymentMethod = undefined;
    if (this.paymentMethods && this.user) {
      this.paymentMethods.forEach(pm => {
        this.preferredPaymentInstrument =
          (pm.paymentInstruments &&
            pm.paymentInstruments.find(pi => pi.id === this.user.preferredPaymentInstrumentId)) ||
          this.preferredPaymentInstrument;
      });
      this.preferredPaymentMethod =
        this.preferredPaymentInstrument &&
        this.paymentMethods.find(pm => pm.id === this.preferredPaymentInstrument.paymentMethod);
    }
  }

  /**
   * deletes a user payment instrument
   */
  deleteUserPayment(paymentInstrumentId: string) {
    if (paymentInstrumentId) {
      this.deletePaymentInstrument.emit(paymentInstrumentId);
    }
  }

  /**
   * change the user's preferred payment instrument
   */
  setAsDefaultPayment(paymentInstrumentId: string) {
    if (paymentInstrumentId) {
      this.updateDefaultPaymentInstrument.emit({
        ...this.user,
        preferredPaymentInstrumentId: paymentInstrumentId,
      });
    }
  }
}
