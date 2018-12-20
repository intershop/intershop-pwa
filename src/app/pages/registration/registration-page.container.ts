import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { CreateUser, getUserError } from 'ish-core/store/user';

/**
 * The Registration Page Container renders the customer registration form using the {@link RegistrationFormComponent}
 *
 */
@Component({
  templateUrl: './registration-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageContainerComponent {
  userCreateError$ = this.store.pipe(select(getUserError));

  constructor(private store: Store<{}>, private router: Router, @Inject(AVAILABLE_LOCALES) public locales: Locale[]) {}

  onCancel() {
    this.router.navigate(['/home']);
  }

  onCreate(customer: Customer) {
    this.store.dispatch(new CreateUser({ customer }));
  }
}
