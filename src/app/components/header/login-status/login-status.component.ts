import { Component, OnInit } from '@angular/core';
import { AccountLoginService } from '../../../services/account-login/account-login.service';
import { Router } from '@angular/router';
import { UserDetail } from '../../../services/account-login/account-login.model';
import { GlobalState } from '../../../services';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';

@Component({
    selector: 'is-login-status',
    templateUrl: './login-status.component.html'
})

export class LoginStatusComponent implements OnInit {
    userDetail: UserDetail;
    isLoggedIn: boolean;
  userDetailKey = 'customerDetails';

  constructor(private accountLoginService: AccountLoginService,
        private router: Router,
              private globalState: GlobalState,
              public localize: LocalizeRouterService) {
    }

    ngOnInit() {
        this.globalState.subscribeCachedData(this.userDetailKey, (data: UserDetail) => {
            this.setUserDetails(data);
            this.globalState.subscribe(this.userDetailKey, (customerDetails: UserDetail) => {
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
        }
    }

    /**
     * navigates to register page
     * @returns void
     */
    register(): void {
    const translatedPath = this.localize.translateRoute('/register');
    this.router.navigate([translatedPath]);
  }

    /**
     * navigates to login page
     * @returns void
     */
    logout(): void {
        this.accountLoginService.logout();
        this.userDetail = null;
        this.isLoggedIn = false;
    const translatedPath = this.localize.translateRoute('/home');
    this.router.navigate([translatedPath]);
  }

    /**
     * navigates to signin page
     * @returns void
     */
    signIn(): void {
    const translatedPath = this.localize.translateRoute('/login');
    this.router.navigate([translatedPath]);
  }
}
