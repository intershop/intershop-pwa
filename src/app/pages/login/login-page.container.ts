import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';

/**
 * The Login Page Container displays the login page component {@link LoginPageComponent} as wrapper for the login form
 */
@Component({
  templateUrl: './login-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageContainerComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
  }
}
