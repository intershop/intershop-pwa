import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The Login Page Component displays a login page with a login form. See also {@link LoginPageContainerComponent}.
 *
 * @example
 * <ish-login-page [isLoggedIn]="isLoggedIn$ | async"></ish-login-page>
 */
@Component({
  selector: 'ish-login-page',
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  @Input() isLoggedIn: boolean;
}
