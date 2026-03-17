import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { IdentityProviderLoginComponent } from 'ish-shared/components/login/identity-provider-login/identity-provider-login.component';

/**
 * The Login Page Container displays the login page component {@link LoginPageComponent} as wrapper for the login form
 */
@Component({
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LoadingComponent,
    TranslatePipe,
    LoadingComponent,
    AsyncPipe,
    IdentityProviderLoginComponent,
    RouterLink],
})
export class LoginPageComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  loginMessageKey$: Observable<string>;
  routingInProgress$: Observable<boolean>;

  constructor(
    private accountFacade: AccountFacade,
    private route: ActivatedRoute,
    private appFacade: AppFacade
  ) {}

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
