import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { AccountAddressesComponent } from './account-addresses/account-addresses.component';

/**
 * The Account Addresses Page Component renders the account addresses page of a logged in user.
 *
 */
@Component({
  templateUrl: './account-addresses-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AccountAddressesComponent, AsyncPipe, LoadingComponent],
})
export class AccountAddressesPageComponent implements OnInit {
  loading$: Observable<boolean>;
  errorAddresses$: Observable<HttpError>;
  errorUser$: Observable<HttpError>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.loading$ = this.accountFacade.addressesLoading$;
    this.errorAddresses$ = this.accountFacade.addressesError$;
    this.errorUser$ = this.accountFacade.userError$;
  }
}
