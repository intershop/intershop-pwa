import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Registration Page Container renders the customer registration form using the {@link RegistrationFormComponent}
 *
 */
@Component({
  templateUrl: './registration-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent implements OnInit {
  userError$: Observable<HttpError>;

  constructor(private accountFacade: AccountFacade, private router: Router) {}

  ngOnInit() {
    this.userError$ = this.accountFacade.userError$;
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onCreate(body: CustomerRegistrationType) {
    this.accountFacade.createUser(body);
  }
}
