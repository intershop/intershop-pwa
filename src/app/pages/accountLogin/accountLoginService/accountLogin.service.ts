import { Injectable, Injector, EventEmitter } from '@angular/core'
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { AccountLoginMockService } from './accountLogin.service.mock';
import { AccountLoginApiService } from './accountLogin.service.api';
import { AccountLogin } from '../accountLogin';
import { CacheCustomService } from '../../../shared/services/cache/cacheCustom.service';
import { UserDetail } from './accountLogin.model';
import {InstanceService} from '../../../shared/services/instance.service';

@Injectable()
export class AccountLoginService implements ILoginService {

    loginService: ILoginService;
    cacheService: CacheCustomService;
    loginStatusEmitter = new EventEmitter();
    constructor(private instanceService: InstanceService) {
        this.loginService = this.instanceService.getInstance((environment.needMock) ?
            AccountLoginMockService : AccountLoginApiService);
        this.cacheService = this.instanceService.getInstance(CacheCustomService);
    }
    /**
     * calls signin function of concerned service
     * @param  {} userDetails
     * @returns Observable
     */
    singinUser(userDetails: AccountLogin): Observable<UserDetail> {
        return this.loginService.singinUser(userDetails).map((data) => {
            this.storeUserDetail(data);
            return data;
        });
    }

    /**
     * calls logout function of concerned service
     * @returns void
     */
    logout(): void {
        this.cacheService.deleteCacheKey('userDetail');
        return this.loginService.logout();
    }

    /**
     * calls isAuthorized function of concerned service
     * @returns boolean
     */
    isAuthorized(): boolean {
        return this.loginService.isAuthorized();
    }


    /**
     * store user details in cache and emits to login status component
     * @param  {UserDetail} userDetail
     */
    private storeUserDetail(userDetail: UserDetail) {
        this.cacheService.storeDataToCache(userDetail, 'userDetail', false)
        this.loginStatusEmitter.emit(userDetail);
    }

}

export interface ILoginService {
    singinUser(userDetails: AccountLogin): Observable<UserDetail>,
    logout(): void,
    isAuthorized(): boolean,
}
