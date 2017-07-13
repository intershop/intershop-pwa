import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { AccountLogin } from '../accountLogin';
import { ApiService, JwtService, CacheCustomService } from '../../../shared/services';
import { UserDetail } from "./accountLogin.model";
import { userData } from ".././accountLogin.mock";


@Injectable()
export class AccountLoginApiService {
    loginStatusEmitter = new EventEmitter();

    constructor(
        private apiService: ApiService,
        private jwtService: JwtService,
        private http: Http,
    ) { }


    
    /**
     * for logging in
     * @param  {AccountLogin} user
     * @returns Observable
     */
    singinUser(user: AccountLogin): Observable<UserDetail> {
        return this.http.post(`${environment.api_url}token`, 'grant_type=password&username=' + user.userName + "&password=" + user.password)
            .map((res: Response) => {
                const response = res.json();
                if (response.access_token) {
                    this.jwtService.saveToken(response.access_token);
                }
                return this.getUserDetail();
            })
    }

    /**
     * destroys the token and cleans the cache
     * @returns void
     */
    logout(): void {
        this.jwtService.destroyToken();
    }

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
    }
    /**
     * provides detail of logged in user
     * @returns UserDetail
     */
    private getUserDetail(): UserDetail {
        return userData;
    }
}
