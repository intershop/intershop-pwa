import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { Customer } from 'ish-core/models/customer/customer.model';
import { UpdateCustomer, getLoggedInCustomer, getUserError, getUserLoading } from 'ish-core/store/user';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * The Account Profile Company Page Container Component renders a page where the (business) user can change the company data using the {@link AccountProfileCompanyPageComponent}
 */
@Component({
  selector: 'ish-account-profile-company-page-container',
  templateUrl: './account-profile-company-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountProfileCompanyPageContainerComponent implements OnInit {
  currentCustomer$ = this.store.pipe(select(getLoggedInCustomer));
  userError$ = this.store.pipe(select(getUserError));
  userLoading$ = this.store.pipe(select(getUserLoading));

  constructor(private store: Store<{}>, private router: Router) {}

  ngOnInit() {
    // check if the current customer is a business customer, otherwise the profile page is displayed
    this.currentCustomer$
      .pipe(
        whenTruthy(),
        take(1)
      )
      .subscribe(customer => {
        if (!customer.isBusinessCustomer) {
          this.router.navigate(['/account/profile']);
        }
      });
  }

  updateCompanyProfile(customer: Customer) {
    this.store.dispatch(new UpdateCustomer({ customer, successMessage: 'account.profile.update_profile.message' }));
  }
}
