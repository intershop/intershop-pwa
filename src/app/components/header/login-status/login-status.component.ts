import { Component, OnInit } from '@angular/core';
import { GlobalConfiguration } from '../../../configurations/global.configuration';
import { GlobalState } from '../../../services';
import { UserDetail } from '../../../services/account-login/account-login.model';
import { AccountLoginService } from '../../../services/account-login/account-login.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  selector: 'is-login-status',
  templateUrl: './login-status.component.html'
})

export class LoginStatusComponent implements OnInit {
  userDetail: UserDetail;
  isLoggedIn: boolean;
  customerDetailKey = 'customerDetails';

  /**
   * Constructor
   * @param {AccountLoginService} accountLoginService
   * @param {GlobalState} globalState
   * @param {GlobalConfiguration} globalConfiguration
   * @param {LocalizeRouterService} localizeRouterService
   */
  constructor(private accountLoginService: AccountLoginService,
              private globalState: GlobalState,
              private globalConfiguration: GlobalConfiguration,
              public localizeRouterService: LocalizeRouterService) {
  }

  ngOnInit() {
    this.globalState.subscribeCachedData(this.customerDetailKey, (data: UserDetail) => {
      this.setUserDetails(data);
      this.globalState.subscribe(this.customerDetailKey, (customerDetails: UserDetail) => {
        this.setUserDetails(customerDetails);
      });
    });
  }

  /**
   * Sets user Details
   * @param  {} userData
   */
  private setUserDetails(userData: UserDetail) {
    if (userData) {
      this.isLoggedIn = true;
      this.userDetail = userData;
      this.userDetail['hasRole'] = true;
    } else {
      this.userDetail = null;
      this.isLoggedIn = false;
    }
  }

  /**
   * navigates to register page
   * @returns void
   */
  register() {
    this.globalConfiguration.getApplicationSettings().subscribe(accountSettings => {
      accountSettings.useSimpleAccount ? this.localizeRouterService.navigateToRoute('/login') : this.localizeRouterService.navigateToRoute('/register');
    });
    return false;
  }

  /**
   * navigates to login page
   * @returns void
   */
  logout() {
    this.accountLoginService.logout();
    this.userDetail = null;
    this.isLoggedIn = false;
    this.localizeRouterService.navigateToRoute('/home');
    return false;
  }
}
