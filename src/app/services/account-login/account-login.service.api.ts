import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { UserDetail } from './account-login.model';
import { ApiService } from '../../services/api.service';
import { JwtService } from '../../services/jwt.service';
import { HttpHeaders } from '@angular/common/http';


@Injectable()
export class AccountLoginApiService {
    loginStatusEmitter = new EventEmitter();

    /**
     * Constructor
     * @param apiService
     * @param jwtService
     * @param http
     */
    constructor(private apiService: ApiService, private jwtService: JwtService) { };

    /**
     * For logging in
     * @param  {AccountLogin} user
     * @returns Observable
     */
    singinUser(user): Observable<UserDetail> {
    const headers = new HttpHeaders().set('Authorization', 'BASIC ' + Buffer.from((user.userName + ':' + user.password)).toString('base64'));
            return this.apiService.get('customers/-', null, headers );
      };

    /**
     * Destroys the token and cleans the cache
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
        } else { return false; }
    };
}
