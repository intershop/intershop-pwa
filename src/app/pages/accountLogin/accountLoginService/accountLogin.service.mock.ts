import { Injectable, EventEmitter } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { AccountLogin } from '../accountLogin';
import { Router } from '@angular/router'
import { UserDetail } from './accountLogin.model';
import { userData } from '../accountLogin.mock';
import {JwtService} from '../../../shared/services/jwt.service';
import {CacheCustomService} from '../../../shared/services/cache/cacheCustom.service';

@Injectable()
export class AccountLoginMockService {
    loginStatusEmitter = new EventEmitter();
    authorizedUser: AccountLogin =
    {
        userName: 'intershop@123.com',
        password: '123456'
    }

    /**
     * construcot
     * @param router 
     * @param jwtService 
     * @param cacheService 
     */
    constructor(private router: Router, private jwtService: JwtService, private cacheService: CacheCustomService
    ) { };


    /**
     * For logging in
     * @param  {AccountLogin} user
     * @returns Observable
     */
    singinUser(user: AccountLogin): Observable<UserDetail> {
        if (user.userName === this.authorizedUser.userName && user.password === this.authorizedUser.password) {
            let token = Math.floor(100000 + Math.random() * 900000).toString();
            this.jwtService.saveToken(token);
            return this.getUserDetail();
        }
        else {
            return Observable.of(null);
        }
    };

    /**
     * Destoys the token and cleans the cache
     * @returns void
     */
    logout(): void {
        this.jwtService.destroyToken();
    };


    /**
     * Checks if the user is logged in
     * @returns boolean
     */
    isAuthorized(): boolean {
        if (this.jwtService.getToken()) {
            return true;
        }
        else {
            return false;
        }
    };

    /**
     * Provides detail of logged in user
     * @returns Observable
     */
    private getUserDetail(): Observable<UserDetail> {
        return Observable.of(userData);
    };
}


