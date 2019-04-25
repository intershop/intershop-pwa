import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getUserAuthorized } from 'ish-core/store/user';

/**
 * The Login Page Container displays the login page component {@link LoginPageComponent} as wrapper for the login form
 */
@Component({
  templateUrl: './login-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageContainerComponent {
  isLoggedIn$ = this.store.pipe(select(getUserAuthorized));

  constructor(private store: Store<{}>) {}
}
