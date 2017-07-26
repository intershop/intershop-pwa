import { Injectable, Injector, EventEmitter } from '@angular/core'
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { AccountLoginMockService } from './accountLogin.service.mock';
import { AccountLoginApiService } from './accountLogin.service.api';
import { AccountLogin } from '../accountLogin';
import { CacheCustomService } from '../../../shared/services/cache/cacheCustom.service';
import { UserDetail } from './accountLogin.model';
import { InstanceService } from '../../../shared/services/instance.service';

export interface IAccountLoginService {
    singinUser(userDetails: AccountLogin): Observable<UserDetail>,
    logout(): void,
    isAuthorized(): boolean,
};

@Injectable()
export class AccountLoginService implements IAccountLoginService {

    loginService: IAccountLoginService;
    cacheService: CacheCustomService;
    loginStatusEmitter: EventEmitter<UserDetail> = new EventEmitter<UserDetail>();


    /**
     * Constructor
     * @param  {InstanceService} privateinstanceService
     */
    constructor(private instanceService: InstanceService) {
        this.loginService = this.instanceService.getInstance((environment.needMock) ?
            AccountLoginMockService : AccountLoginApiService);
        this.cacheService = this.instanceService.getInstance(CacheCustomService);
    };

    /**
     * Calls signin function of concerned service
     * @param  {} userDetails
     * @returns Observable
     */
    singinUser(userDetails: AccountLogin): Observable<UserDetail> {
        return this.loginService.singinUser(userDetails).map((data) => {
            this.storeUserDetail(data);
            return data;
        });
    };

    /**
     * Calls logout function of concerned service
     * @returns void
     */
    logout(): void {
        this.cacheService.deleteCacheKey('userDetail');
        return this.loginService.logout();
    };

    /**
     * calls isAuthorized function of concerned service
     * @returns boolean
     */
    isAuthorized(): boolean {
        return this.loginService.isAuthorized();
    };

    /**
     * Stores user details in cache and emits to login status component
     * @param  {UserDetail} userDetail
     */
    private storeUserDetail(userDetail: UserDetail) {
        this.cacheService.storeDataToCache(userDetail, 'userDetail', false)
        this.loginStatusEmitter.emit(userDetail);
    }

};
