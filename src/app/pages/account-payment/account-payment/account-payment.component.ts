import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, filter, takeUntil } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';

/**
 * The Account Payment Component displays the preferred payment method/instrument of the user
 * and any further payment options. The user can delete payment instruments and change the preferred payment method/instrument.
 * Adding a payment instrument is only possible during the checkout.
 * see also: {@link AccountPaymentPageComponent}
 */
@Component({
  selector: 'ish-account-payment',
  templateUrl: './account-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPaymentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() paymentMethods: PaymentMethod[];
  @Input() user: User;

  preferredPaymentInstrument: PaymentInstrument;
  savedPaymentMethods: PaymentMethod[];
  standardPaymentMethods: PaymentMethod[];

  paymentForm: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.paymentForm = new FormGroup({
      id: new FormControl(this.user?.preferredPaymentInstrumentId),
    });

    // trigger update preferred payment method if payment selection changes
    this.paymentForm
      .get('id')
      .valueChanges.pipe(
        filter(paymentInstrumentId => paymentInstrumentId !== this.user.preferredPaymentInstrumentId),
        takeUntil(this.destroy$)
      )
      .subscribe(id => {
        this.setAsDefaultPayment(id);
      });
  }

  /**
   * refreshes the display of the preferred payment instrument and the further payment options.
   */
  ngOnChanges() {
    this.determinePreferredPaymentInstrument();
    this.determineFurtherPaymentMethods();
  }

  private determinePreferredPaymentInstrument() {
    this.preferredPaymentInstrument = undefined;
    if (this.paymentMethods && this.user) {
      this.paymentMethods.forEach(pm => {
        this.preferredPaymentInstrument =
          pm.paymentInstruments?.find(pi => pi.id === this.user.preferredPaymentInstrumentId) ||
          this.preferredPaymentInstrument;
      });
      this.paymentForm?.get('id').setValue(this.preferredPaymentInstrument?.id, { emitEvent: false }); // update form value
    }
  }

  private determineFurtherPaymentMethods() {
    this.savedPaymentMethods = this.paymentMethods?.length
      ? this.paymentMethods.filter(pm => pm.paymentInstruments?.length)
      : [];
    if (this.preferredPaymentInstrument) {
      this.savedPaymentMethods = this.savedPaymentMethods
        .map(pm => ({
          ...pm,
          paymentInstruments: pm.paymentInstruments.filter(pi => pi.id !== this.preferredPaymentInstrument.id),
        }))
        .filter(pm => pm.paymentInstruments?.length);
    }
    this.standardPaymentMethods = this.paymentMethods?.length
      ? this.paymentMethods.filter(pm => !pm.paymentInstruments?.length)
      : [];
  }

  /**
   *  determines the preferred payment method
   */
  getPreferredPaymentMethod() {
    return (
      this.preferredPaymentInstrument &&
      this.paymentMethods.find(pm => pm.id === this.preferredPaymentInstrument.paymentMethod)
    );
  }

  /**
   * deletes a user payment instrument and triggers a toast in case of success
   */
  deleteUserPayment(paymentInstrumentId: string) {
    if (paymentInstrumentId) {
      this.accountFacade.deletePaymentInstrument(paymentInstrumentId, {
        message: 'account.payment.payment_deleted.message',
      });
    }
  }

  /**
   * change the user's preferred payment instrument
   */
  setAsDefaultPayment(id: string) {
    if (id && this.standardPaymentMethods?.some(pm => pm.id === id)) {
      this.accountFacade.updateUserPreferredPaymentMethod(this.user, id, this.preferredPaymentInstrument);
    } else {
      this.accountFacade.updateUserPreferredPaymentInstrument(this.user, id, this.preferredPaymentInstrument);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
