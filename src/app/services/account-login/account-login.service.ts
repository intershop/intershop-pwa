import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AccountLogin } from './account-login';
import { CacheCustomService } from '../../services/cache/cache-custom.service';
import { UserDetail } from './account-login.model';
import { JwtService, GlobalState } from '../../services';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

export interface IAccountLoginService {
    singinUser(userDetails: AccountLogin): Observable<UserDetail>;
    logout(): void;
    isAuthorized(): boolean;
}

@Injectable()
export class AccountLoginService implements IAccountLoginService {
    loginStatusEmitter: EventEmitter<UserDetail> = new EventEmitter<UserDetail>();

    /**
     * @param  {JwtService} privatejwtService
     * @param  {GlobalState} privateglobalState
     * @param  {CacheCustomService} privatecacheService
     */
    constructor(private jwtService: JwtService, private globalState: GlobalState, private cacheService: CacheCustomService, private apiService: ApiService) { }

    /**
     * Calls signin function of concerned service
     * @param  {} userDetails
     * @returns Observable
     */
    singinUser(userDetails: AccountLogin): Observable<UserDetail> {
        const headers = new HttpHeaders().set('Authorization', 'BASIC ' + Buffer.from((userDetails.userName + ':' + userDetails.password)).toString('base64'));
        return this.apiService.get('customers/-', null, headers).map((data) => {
            this.globalState.notifyDataChanged('customerDetails', data);
            this.storeUserDetail(data);
            return data;
        });
    }

    /**
     * Calls logout function of concerned service
     * @returns void
     */
    logout(): void {
        this.cacheService.deleteCacheKey('userDetail');
        this.globalState.notifyDataChanged('customerDetails', null);
        this.jwtService.destroyToken();
    }

    /**
     * calls isAuthorized function of concerned service
     * @returns boolean
     */
    isAuthorized(): boolean {
        return !!this.jwtService.getToken();
    }

    /**
     * Stores user details in cache and emits to login status component
     * @param  {UserDetail} userDetail
     */
    private storeUserDetail(userDetail: UserDetail) {
        if (userDetail && typeof userDetail !== 'string') {
            this.cacheService.storeDataToCache(userDetail, 'userDetail', false);
            this.loginStatusEmitter.emit(userDetail);
        }
    }

}
