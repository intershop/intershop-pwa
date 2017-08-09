import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { AccountLogin } from '../account-login';
import { UserDetail } from './account-login.model';
import { userData } from '.././account-login.mock';
import { ApiService } from '../../../shared/services/api.service';
import { JwtService } from '../../../shared/services/jwt.service';


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
    singinUser(user: AccountLogin): Observable<UserDetail> {
        return this.apiService.post(`${environment.api_url}token`, 'grant_type=password&username=' + user.userName + '&password=' + user.password)
            .map((res: Response ) => {
                const response = JSON.parse(res.toString())
                if (response.access_token) {
                    this.jwtService.saveToken(response.access_token);
                }
                return this.getUserDetail();
            })
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

    /**
     * Provides detail of logged in user
     * @returns UserDetail
     */
    private getUserDetail(): UserDetail {
        return userData;
    };
}
