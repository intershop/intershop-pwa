import { Component, OnInit } from '@angular/core';
import { AccountLoginService } from '../../../services/account-login/account-login.service';
import { Router } from '@angular/router';
import { UserDetail } from '../../../services/account-login/account-login.model';
import { GlobalState } from '../../../services';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { GlobalConfiguration } from '../../../global-configuration/global-configuration';

@Component({
  selector: 'is-login-status',
  templateUrl: './login-status.component.html'
})

export class LoginStatusComponent implements OnInit {
  userDetail: UserDetail;
  isLoggedIn: boolean;
  customerDetailKey = 'customerDetails';

  constructor(private accountLoginService: AccountLoginService,
              private router: Router,
              private globalState: GlobalState,
              private globalConfiguration: GlobalConfiguration,
              public localize: LocalizeRouterService) {
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
      accountSettings.useSimpleAccount ? this.router.navigate([this.localize.translateRoute('/login')]) : this.router.navigate([this.localize.translateRoute('/register')]);
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
    this.router.navigate([this.localize.translateRoute('/home')]);
    return false;
  }

  /**
   * navigates to signin page
   * @returns void
   */
  signIn() {
    this.router.navigate([this.localize.translateRoute('/login')]);
    return false;
  }

  /**
   * navigates to accountOverview page
   * @returns void
   */
  accountOverview() {
    this.router.navigate(['accountOverview']);
    return false;
  }
}
