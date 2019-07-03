import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

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
export class LoginPageComponent implements OnInit {
  @Input() isLoggedIn: boolean;

  loginMessageKey: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      const messageKey = params.get('messageKey');
      this.loginMessageKey = messageKey ? `account.login.${messageKey}.message` : undefined;
    });
  }
}
