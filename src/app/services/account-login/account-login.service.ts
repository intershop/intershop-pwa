import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { JwtService } from '../../services';
import { ApiService } from '../../services/api.service';
import { AccountLogin } from './account-login';
import { UserDetail } from './account-login.model';
import { UserDetailService } from './user-detail.service';

export interface IAccountLoginService {
  singinUser(userDetails: AccountLogin): Observable<UserDetail>;
  logout(): void;
  isAuthorized(): boolean;
}

@Injectable()
export class AccountLoginService implements IAccountLoginService {

  constructor(private jwtService: JwtService, private userDetailService: UserDetailService, private apiService: ApiService) { }

  /**
   * Calls signin function of concerned service
   * @param  {} userDetails
   * @returns Observable
   */
  singinUser(userDetails: AccountLogin): Observable<UserDetail> {
    const headers = new HttpHeaders().set('Authorization', 'BASIC ' + Buffer.from((userDetails.userName + ':' + userDetails.password)).toString('base64'));
    return this.apiService.get('customers/-', null, headers).map((data) => {
      if ((typeof (data) === 'object')) {
        this.userDetailService.setUserDetail(data);
      }
      return data;
    });
  }

  createUser(userDetails): Observable<UserDetail> {
    // TODO: creating the user should be done with a method from account-login.service
    this.userDetailService.setUserDetail(userDetails);
    return Observable.of(userDetails);
  }

  /**
   * calls isAuthorized function of concerned service
   * @returns boolean
   */
  isAuthorized(): boolean {
    return (!!this.jwtService.getToken()) && (!!this.userDetailService.current);
  }

  /**
  * Calls logout function of concerned service
  * @returns void
  */
  logout(): void {
    this.jwtService.destroyToken();
    this.userDetailService.setUserDetail(null);
  }

  subscribe(callback: (userDetail: UserDetail) => void) {
    this.userDetailService.subscribe(callback);
  }
}
