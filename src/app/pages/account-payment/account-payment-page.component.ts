import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';

/**
 * The Account Payment Page Component renders the account payment component of a logged in user using the {@link AccountPaymentComponent}
 */
@Component({
  selector: 'ish-account-payment-page',
  templateUrl: './account-payment-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPaymentPageComponent implements OnInit {
  paymentMethods$: Observable<PaymentMethod[]>;
  user$: Observable<User>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.paymentMethods$ = this.accountFacade.paymentMethods$();
    this.error$ = this.accountFacade.userError$;
    this.loading$ = this.accountFacade.userLoading$;
    this.user$ = this.accountFacade.user$;
  }

  deletePaymentInstrument(instrumentId: string) {
    this.accountFacade.deletePaymentInstrument(instrumentId);
  }

  updateDefaultPaymentInstrument(user: User) {
    this.accountFacade.updateUser(user, { message: 'account.payment.payment_created.message' });
  }
}
