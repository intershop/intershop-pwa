import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Locale } from 'ish-core/models/locale/locale.model';

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

  constructor(
    private accountFacade: AccountFacade,
    private router: Router,
    @Inject(AVAILABLE_LOCALES) public locales: Locale[]
  ) {}

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
