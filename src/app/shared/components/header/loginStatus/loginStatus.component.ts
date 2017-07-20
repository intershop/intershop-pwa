import { Component } from '@angular/core'
import { AccountLoginService } from '../../../../pages/accountLogin/accountLoginService'
import { Router } from '@angular/router'
import { JwtService } from '../../../services/jwt.service';
import { CacheCustomService } from '../../../services/cache/cacheCustom.service';
import { UserDetail } from "../../../.././pages/accountLogin/accountLoginService/accountLogin.model";

@Component({
    selector: 'is-loginstatus',
    templateUrl: './loginStatus.component.html'
})

export class LoginStatusComponent {
    userDetail: UserDetail;
    isLoggedIn: boolean;
    userDetailKey = 'userDetail';
    constructor(
        private accountLoginService: AccountLoginService,
        private router: Router,
        private jwtService: JwtService,
        private cacheCustomService: CacheCustomService
    ) {
    }

    ngOnInit() {
        if (this.accountLoginService.isAuthorized()) {
            if (this.cacheCustomService.cacheKeyExists(this.userDetailKey)) {
                this.isLoggedIn = true;
                this.userDetail = this.cacheCustomService.getCachedData(this.userDetailKey);
            }
        }
        this.accountLoginService.loginStatusEmitter.subscribe((userDetailData: UserDetail) => {
            this.isLoggedIn = true;
            this.userDetail = userDetailData;
        })
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
        this.router.navigate(['login']);
    }

    /**
     * navigates to signin page
     * @returns void
     */
    signIn(): void {
        this.router.navigate(['login']);
    }

}

