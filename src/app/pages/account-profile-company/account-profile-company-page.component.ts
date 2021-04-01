import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * The Account Profile Company Page Container Component renders a page where the (business) user can change the company data using the {@link AccountProfileCompanyPageComponent}
 */
@Component({
  selector: 'ish-account-profile-company-page',
  templateUrl: './account-profile-company-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileCompanyPageComponent implements OnInit, OnDestroy {
  currentCustomer$: Observable<Customer>;
  userError$: Observable<HttpError>;
  userLoading$: Observable<boolean>;

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade, private router: Router) {}

  ngOnInit() {
    this.currentCustomer$ = this.accountFacade.customer$;
    this.userError$ = this.accountFacade.userError$;
    this.userLoading$ = this.accountFacade.userLoading$;

    // check if the current customer is a business customer, otherwise the profile page is displayed
    this.currentCustomer$.pipe(whenTruthy(), take(1), takeUntil(this.destroy$)).subscribe(customer => {
      if (!customer.isBusinessCustomer) {
        this.router.navigate(['/account/profile']);
      }
    });
  }

  updateCompanyProfile(customer: Customer) {
    this.accountFacade.updateCustomerProfile(customer, { message: 'account.profile.update_company_profile.message' });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
