import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AccountLogin } from './account-login';
import { CacheCustomService } from '../cache/cache-custom.service';
import { UserDetail } from './account-login.model';
import { JwtService, GlobalState } from '../../services';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';

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
      if ((typeof (data) === 'object')) {
        this.storeUserDetail(data);
      }
      return data;
    });
  }

  /**
   * calls isAuthorized function of concerned service
   * @returns boolean
   */
  isAuthorized(): boolean {
    return !!this.jwtService.getToken();
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
   * Stores user details in cache and emits to login status component
   * @param  {UserDetail} userDetail
   */
  public storeUserDetail(userDetail: UserDetail) {
    if (environment.needMock) {
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      this.jwtService.saveToken(token);
    }
    this.globalState.notifyDataChanged('customerDetails', userDetail);
  }

}
