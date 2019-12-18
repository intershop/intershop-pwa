import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';

/**
 * The Login Page Container displays the login page component {@link LoginPageComponent} as wrapper for the login form
 */
@Component({
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  loginMessageKey$: Observable<string>;

  constructor(private accountFacade: AccountFacade, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;

    this.loginMessageKey$ = this.route.queryParamMap.pipe(
      map(params => params.get('messageKey')),
      map(messageKey => (messageKey ? `account.login.${messageKey}.message` : undefined))
    );
  }
}
