import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { User } from 'ish-core/models/user/user.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountPaymentComponent } from './account-payment/account-payment.component';

/**
 * The Account Payment Page Component renders the account payment component of a logged in user using the {@link AccountPaymentComponent}
 */
@Component({
  selector: 'ish-account-payment-page',
  templateUrl: './account-payment-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AccountPaymentComponent, AsyncPipe, ErrorMessageComponent, LoadingComponent, TranslatePipe],
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
}
