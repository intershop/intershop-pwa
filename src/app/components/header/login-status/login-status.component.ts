import { Component } from '@angular/core';
import { GlobalConfiguration } from '../../../configurations/global.configuration';
import { UserDetail } from '../../../services/account-login/account-login.model';
import { AccountLoginService } from '../../../services/account-login/account-login.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  selector: 'is-login-status',
  templateUrl: './login-status.component.html'
})

export class LoginStatusComponent {

  userDetail: UserDetail = null;

  constructor(
    private accountLoginService: AccountLoginService,
    private globalConfiguration: GlobalConfiguration,
    public localize: LocalizeRouterService
  ) {
    accountLoginService.subscribe(userDetail => this.userDetail = userDetail);
  }

  get isLoggedIn() {
    return this.accountLoginService.isAuthorized();
  }

  /**
   * navigates to register page
   * @returns void
   */
  register() {
    this.globalConfiguration.getApplicationSettings().subscribe(accountSettings => {
      accountSettings.useSimpleAccount ? this.localize.navigateToRoute('/login') : this.localize.navigateToRoute('/register');
    });
    return false;
  }

  /**
   * navigates to login page
   * @returns void
   */
  logout() {
    this.accountLoginService.logout();
    this.localize.navigateToRoute('/home');
    return false;
  }
}
