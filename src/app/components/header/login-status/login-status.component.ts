import { Component, OnInit } from '@angular/core';
import { AccountLoginService } from '../../../services/account-login/account-login.service';
import { Router } from '@angular/router';
import { UserDetail } from '../../../services/account-login/account-login.model';
import { GlobalState } from '../../../services';

@Component({
    selector: 'is-login-status',
    templateUrl: './login-status.component.html'
})

export class LoginStatusComponent implements OnInit {
    userDetail: UserDetail;
    isLoggedIn: boolean;
    userDetailKey = 'customerDetails';
    constructor(
        private accountLoginService: AccountLoginService,
        private router: Router,
        private globalState: GlobalState
    ) {
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
        this.router.navigate(['register']);
    }

    /**
     * navigates to login page
     * @returns void
     */
    logout(): void {
        this.accountLoginService.logout();
        this.userDetail = null;
        this.isLoggedIn = false;
        this.router.navigate(['home']);
    }

    /**
     * navigates to signin page
     * @returns void
     */
    signIn(): void {
        this.router.navigate(['login']);
    }
}
