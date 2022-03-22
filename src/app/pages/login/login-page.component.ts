import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';

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
  routingInProgress$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade, private route: ActivatedRoute, private appFacade: AppFacade) {}

  ngOnInit() {
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
    if (SSR) {
      // SSR response should always display loading animation
      this.routingInProgress$ = of(true);
    } else {
      this.routingInProgress$ = this.appFacade.routingInProgress$;
    }

    this.loginMessageKey$ = this.route.queryParamMap.pipe(
      map(params => params.get('messageKey')),
      map(messageKey => (messageKey ? `account.login.${messageKey}.message` : undefined))
    );
  }
}
