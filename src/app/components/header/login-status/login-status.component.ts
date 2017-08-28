import { Component, OnInit } from '@angular/core';
import { AccountLoginService } from 'app/services/account-login/account-login.service';
import { Router } from '@angular/router';
import { CacheCustomService } from 'app/services/cache/cache-custom.service';
import { UserDetail } from 'app/services/account-login/account-login.model';

@Component({
    selector: 'is-login-status',
    templateUrl: './login-status.component.html'
})

export class LoginStatusComponent implements OnInit {
    userDetail: UserDetail;
    isLoggedIn: boolean;
    userDetailKey = 'userDetail';
    constructor(
        private accountLoginService: AccountLoginService,
        private router: Router,
        private cacheCustomService: CacheCustomService
    ) {
    }

    ngOnInit() {
        if (this.accountLoginService.isAuthorized()) {
            if (this.cacheCustomService.cacheKeyExists(this.userDetailKey)) {
                this.isLoggedIn = true;
                this.userDetail = this.cacheCustomService.getCachedData(this.userDetailKey);
                this.userDetail['hasRole'] = true;
            }
        }
        this.accountLoginService.loginStatusEmitter.subscribe((userDetailData: UserDetail) => {
            this.isLoggedIn = true;
            this.userDetail = userDetailData;
            this.userDetail['hasRole'] = true;
        })
    };

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

