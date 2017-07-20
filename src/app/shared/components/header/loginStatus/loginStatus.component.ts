import { Component } from '@angular/core'
import { AccountLoginService } from '../../../../pages/accountLogin/accountLoginService'
import { Router } from '@angular/router'
import {JwtService} from '../../../services/jwt.service';
import {CacheCustomService} from '../../../services/cache/cacheCustom.service';

@Component({
    selector: 'is-loginstatus',
    templateUrl: './loginStatus.component.html'
})

export class LoginStatusComponent {
    userName: string;
    constructor(
        private accountLoginService: AccountLoginService,
        private router: Router,
        private jwtService: JwtService,
        private cacheCustomService: CacheCustomService
    ) {
    }

    ngOnInit() {
        if (this.accountLoginService.isAuthorized()) {
            if (this.cacheCustomService.cacheKeyExists('userDetail')) {
                this.userName = this.cacheCustomService.getCachedData('userDetail').firstName + ' ' + this.cacheCustomService.getCachedData('userDetail').lastName;
            }
        }
        this.accountLoginService.loginStatusEmitter.subscribe(data => {
            this.userName = data.firstName + ' ' + data.lastName;
        })
    }

    /**
     * navigates to register page
     * @returns void
     */
    register():void {
        this.router.navigate(['register']);
    }

    /**
     * navigates to login page
     * @returns void
     */
    logout():void {
        this.accountLoginService.logout();
        this.userName = '';
        this.router.navigate(['login']);
    }

    /**
     * navigates to signin page
     * @returns void
     */
    signIn():void {
        this.router.navigate(['login']);
    }

}

